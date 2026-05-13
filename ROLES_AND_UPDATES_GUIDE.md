# ITC Haridwar COT PM Module — How to add Admins, Update files, etc.

This is your "what do I click when I need to change something" reference. No coding required.

---

## What changed in this version

**New features:**

- **Role-based access** — admins can do everything, viewers can only view + upload/download files
- **MTTR / MTBF tracking** — measure repair time (minutes) and time between breakdowns (hours)
- **Pre-due notifications** — red banner for overdue, amber banner for due in next 3 days
- **Date format** — DD-MM-YYYY everywhere (in the dashboard and Excel)
- **Compliance % capped at 100%** — no more weird 112% numbers
- **Total Motors by Area** chart on the new Reliability page

**New columns in the upload template:**

- `PM Start` — when PM work began (format: `15-04-2026 09:30`)
- `PM Stop` — when PM work ended (format: `15-04-2026 10:45`)
- `B/D Start` — when a breakdown started (only fill if there was one)
- `B/D Stop` — when the breakdown was resolved

MTTR auto-calculates from PM Start → PM Stop. MTBF calculates from B/D Start → B/D Stop.

---

## Step-by-step: How to make someone admin

By default, **every new user is a Viewer** (read-only with upload/download rights). To give someone full admin rights, you need to add their User ID to the `admins` collection in Firestore.

**You'll do this once per admin** — usually just for you initially, then for any team lead later.

### Step 1 — Get the user's User ID (UID)

1. Open Firebase Console: **https://console.firebase.google.com**
2. Pick your **itc-cot-pm** project (or whatever you named it)
3. Left sidebar → **Build** → **Authentication**
4. Click the **Users** tab at the top
5. Find the email of the person you want to make admin
6. **Copy their User UID** — it's a long string in the rightmost column (looks like `xZ4kP9mNqLb...` — about 28 characters)

   *Tip: hover over the UID, a copy icon appears.*

### Step 2 — Add them to the admins list

1. Left sidebar → **Build** → **Firestore Database**
2. Look for a "Start collection" button (top-center area) OR click **+ Start collection** at the root level
3. If this is your **first time** adding an admin:
   - **Collection ID:** type `admins` (lowercase, exactly this)
   - Click **Next**
   - **Document ID:** paste the UID you copied
   - Add a field (any name works, e.g. `email`) with their email as the value
   - Click **Save**
4. If `admins` collection **already exists**:
   - Click on **`admins`** in the collections list
   - Click **+ Add document**
   - **Document ID:** paste the UID
   - Add a field `email` with their email as the value
   - Click **Save**

### Step 3 — They sign in again

Tell the person to:
1. Log out of the app (if they were already signed in)
2. Log back in
3. Look at the sidebar — the "Your Access" tile should now show **ADMIN** in green

That's it. They now have full rights.

### To revoke admin rights

Same place — Firestore → `admins` collection → click their document → **Delete document** (red trash icon). They'll be a viewer again after their next refresh.

---

## What each role can do

| Action | Admin | Viewer |
|---|---|---|
| View all pages, all data | ✅ | ✅ |
| Use FY/Month/Area filters | ✅ | ✅ |
| **Download CSV template** | ✅ | ✅ |
| **Export executions** | ✅ | ✅ |
| **Backup data (JSON)** | ✅ | ✅ |
| **Upload weekly CSV** | ✅ | ❌ (preview yes, commit no) |
| Mark PM done / undo | ✅ | ❌ |
| Add motor / Edit motor / Delete motor | ✅ | ❌ |
| Generate next FY | ✅ | ❌ |
| Clear logged data | ✅ | ❌ |
| Factory reset | ✅ | ❌ |
| Restore backup | ✅ | ❌ |

Viewers see the buttons greyed out or hidden. If they try to act on something they can't, they get a polite "Admin only" toast notification.

---

## How to update files on GitHub (when I send you a new version)

This happens when:
- I send you a new `motor-pm.html` with fixes/features
- You want to update the Panel PM module
- You need to change firebase-config or rules

### Replacing a file

1. Open **https://github.com** and sign in
2. Click your profile picture (top right) → **Your repositories**
3. Click **`itc-pm`** (or whatever you named the repo)
4. Click the filename you want to update (e.g. `motor-pm.html`)
5. Click the **pencil icon** ✏️ at the top right of the file viewer
6. **Select all** the content (Ctrl+A on Windows, Cmd+A on Mac)
7. **Delete** everything
8. **Paste** the new file content
9. Scroll down. Commit message: `Update motor-pm.html` (or describe what changed)
10. Click green **Commit changes**

**Wait 2 minutes** for GitHub Pages to redeploy, then **hard refresh** your live page (Ctrl+Shift+R / Cmd+Shift+R).

### Uploading a brand new file (e.g. `panel-pm.html`)

1. On the repo page, click **Add file** → **Upload files**
2. Drag the file in (or click "choose your files")
3. Commit message: `Add panel-pm.html`
4. Click **Commit changes**

---

## How to update the Firestore Security Rules (one-time, for this version)

Since this version adds role-based admin rules, you need to update Firestore once:

1. Firebase Console → **Firestore Database** → **Rules** tab (top)
2. Select all the existing rules text (Ctrl+A) and delete it
3. Paste this exactly:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /itc_pm/{docId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null
                      && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
       }
       match /admins/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null
                      && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

4. Click **Publish**

What this does: only admins can change PM data; only admins can promote/demote other admins; everyone else (viewers) can only read.

**Important — make yourself admin BEFORE publishing these rules.** Otherwise nobody will be able to write data and you'll be locked out. The recommended order is:

1. Add yourself to the `admins` collection first (Step 1-2 above)
2. THEN publish the new rules

If you already published rules and got locked out: temporarily change the rule for `itc_pm` writes to `if request.auth != null` (any signed-in user), make yourself admin, then revert.

---

## How the Reliability page works

After uploading execution data with PM Start/Stop and B/D Start/Stop times:

- **MTTR** (Mean Time To Repair) = average time taken to complete a PM, in **minutes**
- **MTBF** (Mean Time Between Failures) = average duration of a breakdown event, in **hours**
- Both can be toggled between **Weighted Average** (default) and **Median**
- Filter by Area — see MTTR/MTBF for one area only
- Five charts:
  - Total Motors by Area (the new requested chart)
  - Breakdowns by Area
  - MTTR by Area (lower = better)
  - MTBF by Area (higher = better)
  - Per-area summary table

---

## How to fill the weekly upload CSV

Open the template you downloaded from **Manage Data → Download Template (CSV)**. Each row is one scheduled PM.

| Column | Required? | Format | Example |
|---|---|---|---|
| PM ID | YES — leave as-is | (auto-filled) | M001-01-FY26-27 |
| Area | (auto-filled) | text | CETP |
| Motor | (auto-filled) | text | Aeration Blower 1 |
| Frequency | (auto-filled) | BM/Q/HY | Q |
| Planned Date | (auto-filled) | DD-MM-YYYY | 15-04-2026 |
| **Actual Date** | YES if PM done | DD-MM-YYYY | 15-04-2026 |
| **PM Start** | Optional, for MTTR | DD-MM-YYYY HH:MM | 15-04-2026 09:00 |
| **PM Stop** | Optional, for MTTR | DD-MM-YYYY HH:MM | 15-04-2026 10:30 |
| **B/D Start** | Only if breakdown | DD-MM-YYYY HH:MM | 20-04-2026 14:00 |
| **B/D Stop** | Only if breakdown | DD-MM-YYYY HH:MM | 20-04-2026 18:00 |
| Remarks | Optional | free text | Replaced bearings |

**Tips for filling efficiently:**
- For a normal PM done in one shift, just fill Actual Date + PM Start + PM Stop
- For a PM that did NOT happen yet, leave all the "actual"/"start"/"stop" columns blank
- For a breakdown event, fill ONLY B/D Start and B/D Stop (the "PM" columns are for planned PMs)
- Excel auto-fills time when you press Ctrl+Shift+: (colon)

**Save as CSV** before uploading. In Excel: File → Save As → CSV (Comma delimited).

---

## When you're ready to add the Panel PM Module

Tell me, and I'll send you `panel-pm.html` ready to drop in. The steps will be:

1. Upload `panel-pm.html` to your repo (Add file → Upload files)
2. Edit `app.html` — replace the placeholder content of the Panel PM tab with an iframe pointing to the new file
3. Done — Panel PM tab becomes live

---

## Quick troubleshooting

**I added someone to admins but the badge still says VIEWER:**
- They need to log out and back in. The role check happens at sign-in.

**Compliance % is showing 0% even though I logged PMs:**
- Make sure your Actual Date is on or before today's date. PMs logged for the future won't count yet.
- Refresh the page (Ctrl+Shift+R).

**MTTR shows 0 in the Reliability page:**
- You need to have at least one PM with both PM Start AND PM Stop filled in.
- If you have those filled, check the dates are in the active FY.

**File didn't update after committing on GitHub:**
- Wait 2 full minutes for GitHub Pages to redeploy.
- Then **hard refresh** with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).
- Still old? Try opening in an Incognito/Private window.

**The CSV import says "Bad date":**
- Date format must be DD-MM-YYYY (e.g. `15-04-2026`).
- DD/MM/YYYY also works (e.g. `15/04/2026`).
- Make sure Excel didn't auto-format your date column to American format MM-DD-YYYY.

---

## File reference (current state)

| File | Purpose | Edit when |
|---|---|---|
| `index.html` | Login page | Almost never |
| `app.html` | Tab shell (Motor PM live, Panel PM placeholder) | Adding Panel PM |
| `motor-pm.html` | The full dashboard | New features arrive |
| `firebase-config.js` | Your Firebase credentials | Project changes |
| `firestore.rules` | Reference copy of security rules | Reference only — actual rules in Firebase Console |
| `HOSTING_GUIDE.md` | Original setup walkthrough | Reference only |
| `ROLES_AND_UPDATES_GUIDE.md` | This file | Reference only |
| `README.md` | Quick reference | Almost never |
