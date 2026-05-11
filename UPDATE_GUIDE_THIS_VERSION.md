# Quick Update Guide — May 2026

This guide is for updating your already-working setup with the latest changes.

**What's new in this version:**
- ✨ "Reliability at a glance" section on the Overview page (4 KPIs + motors-by-area chart)
- ✨ Motor upload template (bulk-add motors via CSV) on the Manage Data page
- ✨ Smart preview before importing motors (shows you what will be added/updated)

**Total time:** 5 minutes. **Only one file changes** — `motor-pm.html`. No Firebase changes needed.

---

## What you need to do (3 steps)

### Step 1 — Open GitHub and your repo

1. Open https://github.com in your browser
2. Sign in if needed
3. Click your profile picture (top right) → **Your repositories**
4. Click **itc-pm** (or whatever you named your repo)

### Step 2 — Replace the motor-pm.html file

1. In the file list, click **motor-pm.html** to open it
2. Look at the top-right of the file viewer — click the **pencil icon** ✏️ (says "Edit this file" if you hover)
3. The file opens in an editor with all the code visible

4. **Select everything in the editor:**
   - Click anywhere in the code first
   - Press **Ctrl+A** (Windows) or **Cmd+A** (Mac)
   - All text becomes highlighted (blue)

5. **Delete everything:**
   - Press **Delete** or **Backspace** key
   - The editor should now be **completely empty**

6. **Copy the new motor-pm.html content:**
   - Download the new `motor-pm.html` from the zip I shared
   - Open it in **Notepad** (Windows) or **TextEdit** (Mac) — NOT in a browser
   - Press **Ctrl+A** to select all
   - Press **Ctrl+C** to copy

7. **Paste into the GitHub editor:**
   - Click back in the empty GitHub editor
   - Press **Ctrl+V** (Windows) or **Cmd+V** (Mac)
   - The file fills back up with the new code

8. **Commit the change:**
   - Scroll all the way down to the bottom of the page
   - You'll see "Commit changes" section
   - In the first box (commit message), type: `Add reliability glance and motor template`
   - Click the green **Commit changes** button

9. GitHub will save and start rebuilding your site (~2 minutes).

### Step 3 — Test it

1. **Wait 2 minutes** (don't skip this — GitHub needs time to publish)
2. Open your live URL in a **new tab** (e.g. `https://yourname.github.io/itc-pm/`)
3. **Hard refresh** the page:
   - Windows: **Ctrl+Shift+R**
   - Mac: **Cmd+Shift+R**
   - This forces your browser to load the new version, not the old cached one
4. Sign in if asked

### Step 4 — Verify the new features work

**On the Overview page:**

- Scroll all the way down
- You should see a new section titled **"Reliability — at a glance"** with 4 tiles:
  - MTTR (min)
  - MTBF (hours)
  - Breakdowns
  - Total Motors
- Below it, a horizontal bar chart **"Total Motors by Area"** showing all your areas
- (Numbers will be 0 until you log execution data with PM start/stop times)

**On the Manage Data page:**

- Look for the **"Motor Master · Add / Edit / Remove"** card
- In the top-right of that card, there are **3 buttons** now:
  - **Export Current** — downloads all current motors
  - **Download Template (CSV)** ← this is the new button
  - **Import Motors (CSV/XLSX)**

**Try the template:**

1. Click **Download Template (CSV)**
2. A file called `ITC_COT_Motor_Template_BLANK.csv` downloads
3. Open it in Excel — you'll see:
   - 4 instruction lines (starting with `#`) at the top
   - A header row: `Area, Motor / Pump, Category`
   - 5 example rows (Raw Water Pump 3, Backwash Pump 2, etc.)
   - 5 blank rows for you to fill
4. Add a test motor in one of the blank rows, like:  
   `Test Area, Test Pump 1, B`
5. Save the file as CSV (File → Save As → CSV format)
6. In the app, click **Import Motors (CSV/XLSX)** → pick your file
7. A confirmation popup appears showing:
   ```
   1 new · 0 updates · 5 skipped/no-change
   First 5 rows:
     • ADD new — Test Pump 1 (Test Area)
     • EXISTS · no change — Raw Water Pump 3 (Phase-1 WTP)
     ...
   Proceed with import?
   ```
8. Click **OK** to commit, or **Cancel** to abort
9. Toast message appears: "Motors imported · 1 added · 0 updated · schedule regenerated"
10. Go to the Motors page → search "Test Pump" → you should see it in the list

---

## Common issues

**The "Reliability — at a glance" section isn't showing up:**
- You didn't hard refresh. Press Ctrl+Shift+R (Cmd+Shift+R on Mac).
- Try opening in a private/incognito window to bypass any browser cache.

**Editor in GitHub looks weird or shows "load diff" warning:**
- The file is large (260 KB). Just wait — GitHub takes a moment to load it.
- If it really won't load, use the alternative method below.

**When I paste, only part of the code appears:**
- The clipboard probably truncated. Try copy-paste in smaller chunks, OR use the alternative method below.

---

## Alternative method (if the editor in GitHub is glitchy with large files)

Instead of using the in-browser editor:

1. On your repo page, click the **motor-pm.html** file
2. At the top-right, look for the **"⋮" three-dot menu** (or click "Raw" first then back to file view)
3. Click **"Delete file"** → confirm deletion → commit
4. Go back to the repo home
5. Click **Add file → Upload files**
6. Drag the new `motor-pm.html` from your desktop
7. Commit with message: `Upload new motor-pm.html`
8. Wait 2 min, hard refresh as before

---

## What did NOT change

You do NOT need to touch:
- Firebase Console — no changes there
- Firestore Rules — same as before
- Any other file (index.html, app.html, firebase-config.js, etc.) — they all stay the same

---

## When you're ready for the next update

Just let me know what's needed, and I'll prepare the next version. I'll send you the changed file and steps similar to this guide.

You can also explore the **Roles and Updates Guide** (`ROLES_AND_UPDATES_GUIDE.md`) for details on:
- Making someone admin
- Updating Firestore security rules  
- Filling the weekly upload CSV with PM Start/Stop and breakdown times
- Troubleshooting

---

## File reference

You should currently have these 8 files in your GitHub repo:

| File | What it does |
|---|---|
| `index.html` | Login screen |
| `app.html` | Tab shell (Motor PM live, Panel PM placeholder) |
| `motor-pm.html` | The main dashboard (← THIS is what you just updated) |
| `firebase-config.js` | Your Firebase credentials |
| `firestore.rules` | Reference copy of security rules |
| `HOSTING_GUIDE.md` | Original setup walkthrough |
| `ROLES_AND_UPDATES_GUIDE.md` | Admin/viewer roles + update instructions |
| `README.md` | Quick reference |
