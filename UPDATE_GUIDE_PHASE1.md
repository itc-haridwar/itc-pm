# Phase 1 Update Guide — Big Feature Release

This is the biggest update so far. Read carefully before starting.

**Total time:** ~15 minutes. **Phone-friendly.** **Only ONE file changes — `motor-pm.html`.** No Firebase changes needed.

---

## What's new in this version

### 1. Role rename: Viewer → User
- "Viewer" is now called "User"
- Users now have **most admin rights** — they can mark PMs done, add motors, import data, generate FYs
- Users CANNOT: backdate PMs (only today's date), delete logs/motors/FYs, factory reset, restore backups, undo executions

### 2. Mark Done → full PM checklist popup
When anyone clicks "Mark Done", a popup opens with:
- **GPS location** captured silently (1C — silent proof you were there)
- **Actual Date** (user restricted to today; admin can backdate)
- **PM Start** and **PM Stop** times (auto-fills current time)
- **Breakdown** times (optional)
- **Full electrical PM checklist** (1E):
  - PI Value
  - IR Value (MΩ)
  - No-load Current (A), Load Current (A)
  - R / Y / B phase Voltages (V)
  - Abnormal Sound (None / Slight / Moderate / Severe)
  - Overall Condition (Good / Acceptable / Action Needed)
  - Observation/Remarks (free text)
- All readings saved permanently, exported with executions

### 3. NEW tab — Area Owners
- Sidebar → **Area Owners**
- Add/edit/remove area owners (Name, Email, Phone)
- CSV bulk upload supported (Download Template provided)
- Areas without an owner are flagged in red
- These owners will receive 3-day-ahead confirmation requests

### 4. NEW tab — Checklist Config
- Sidebar → **Checklist Config**
- Add new checklist fields anytime (e.g. "Winding Temperature", "Coupling Alignment")
- Choose type: Number / Text / Dropdown
- Set as Required or Optional
- Add unit (°C, V, A, MΩ etc.)
- Reset to default fields anytime

### 5. Pre-PM Confirmation workflow (in-app)
- Top-right bell icon shows count of pending confirmations
- Click bell → see all PMs due in next 3 days
- For each PM:
  - **Confirm** button → owner confirms motor can be released
  - **Reschedule** button → opens reschedule popup
- All confirmations & reschedules logged with timestamps + names

### 6. Reschedule with mandatory reason
When rescheduling, owner must pick:
- Motor in continuous operation — can't release
- Manpower constraint
- Spare parts unavailable
- Production schedule conflict
- Safety / shutdown required first
- Other (must specify in textarea)

After 2 reschedules by a user, only admin can reschedule further.

### 7. NEW analytics on Compliance page
- **Reschedule Reasons** chart — see why PMs are getting delayed
- **Reschedules by Area** chart — find the problem areas

---

## STEP-BY-STEP DEPLOY (phone-friendly)

### Step 1 — Replace motor-pm.html on GitHub

1. Open browser on phone → **https://github.com** → sign in
2. Tap profile picture (top right) → **Your repositories** → tap your repo (`itc-pm`)
3. Tap **motor-pm.html** in the file list
4. Tap the **pencil icon ✏️** at the top right of the file viewer
   - On phone, it might show as just a pencil. If you can't find it, try:
     - Browser menu (⋮) → **Desktop site** toggle on → then pencil icon will be visible
5. The file content shows in an editor
6. **Tap inside the editor** → press and hold → **Select all** (or Ctrl+A / Cmd+A)
7. **Delete everything**
8. The new motor-pm.html content (from this update):
   - Open the new `motor-pm.html` file on your phone (download from the bundle)
   - Open it in any text app or browser
   - Select all, copy
9. **Paste** into the GitHub editor
10. Scroll to the bottom → commit message: `Phase 1 update — checklist, GPS, area owners, confirmations`
11. Tap green **Commit changes** button

### Step 2 — Wait and refresh

1. Wait 2 full minutes (GitHub Pages takes time to publish)
2. Open your live URL (https://yourname.github.io/itc-pm/)
3. **Hard refresh:** browser menu → tap reload icon, OR close and reopen the page

### Step 3 — Verify it's live

After signing in, check these:

**A. Sidebar shows new items:**
- ✅ Area Owners
- ✅ Checklist Config
- "Your Access" tile shows **ADMIN** in green for you (since you set yourself admin)

**B. Top-right has bell icon 🔔**
- If you have PMs due in next 3 days, badge shows the count

**C. Click "Mark Done" on a PM (Daily View)**
- A popup should open with checklist fields
- "GPS: Capturing location..." indicator at top
- All 10 default fields shown

**D. Go to Area Owners tab**
- Form to add owner (Area dropdown / Name / Email / Phone)
- Three buttons: Download Template / Export / Import Owners (CSV)
- Table below shows all areas — unmapped ones in red

**E. Go to Checklist Config tab**
- Form to add new checklist fields
- Table shows the 10 default fields

---

## How users (non-admin) experience this

When a non-admin user signs in:
- They see ALL the same pages (no hiding)
- "Your Access" tile shows **USER** in cyan
- They can click "Mark Done" → popup opens → fill checklist → save
- They can ONLY pick today's date in the Actual Date field
- They can add motors, generate FY, import data
- They CANNOT see: "Clear All Logged Data", "Factory Reset", "Restore Backup" buttons (hidden)
- "Delete motor" red X buttons are hidden too

This is enforced both client-side (UI hiding) and by checking role inside each function.

---

## What you need to do AFTER deploying

### Initial setup (one-time, ~10 min)

**1. Add area owners**
- Sidebar → **Area Owners**
- Use the form OR download template, fill, import
- At minimum, set owners for the 5 most critical areas

**2. Review checklist fields**
- Sidebar → **Checklist Config**
- The 10 defaults match standard electrical PM
- Add/remove fields specific to your motors if needed
- Examples you might want to add later:
  - Winding Temperature (°C)
  - Coupling Alignment (Pass/Fail)
  - Lubrication Status (dropdown)
  - Earth Continuity (Ω)

**3. Test the flow on yourself**
- Open Daily View → click Mark Done on any PM
- Fill the checklist completely
- Verify it saves and appears in Execution Log

### Going forward (weekly)

Same workflow as before, with two additions:
- When marking PMs done, fill the checklist (1-2 minutes per motor)
- Each Monday: open bell icon → see pending confirmations → reach out to area owners

---

## Troubleshooting

**The new sidebar items don't appear:**
- You didn't hard refresh. Close browser entirely, reopen, sign in fresh.

**"Mark Done" still shows old behavior (no popup):**
- Same — hard refresh needed.
- Make sure you fully replaced the motor-pm.html file. Half-replacements break things.

**GPS shows "permission denied":**
- Your phone blocked location. PM still gets marked done, just no GPS captured.
- To enable: browser menu → Site settings → Location → Allow

**"Admin only" toast appears when clicking Delete motor:**
- That's correct — Delete is admin-only. Use Mark Done or skip the delete.

**Area Owners table shows everything in red:**
- You haven't added any owners yet. Use the form or import CSV.

**Pending Confirmations badge stays at 0:**
- No PMs are due in the next 3 days right now. This is normal. As dates approach, the count grows.

**After importing motors, schedule didn't update:**
- The system auto-regenerates schedule on motor import. If not, click "Regenerate Schedule" in Manage Data.

---

## What didn't change

- Login flow (same as before)
- Firebase Console (no changes needed)
- Firestore rules (no changes needed — your existing rules work)
- index.html / app.html / firebase-config.js (no changes)
- Excel files (still v5)

Only `motor-pm.html` is updated.

---

## Roll back if something breaks

If after the update something seems broken:

1. Go to GitHub → repo → motor-pm.html
2. Click "History" or "Commits" link
3. Find the previous commit (before this update)
4. Click on it → click "..." → "Revert this commit"
5. Wait 2 min, hard refresh

Your data is in Firebase — file rollback doesn't lose data.

---

## Phase 2 (later)

Once you've used Phase 1 for a week and the team is engaging:
- We add **automated email** to area owners (Cloudflare Worker + Gmail SMTP — free forever)
- Email links go to a no-login confirmation page

For now, owners confirm/reschedule by logging into the app directly. Tell them to bookmark the URL.
