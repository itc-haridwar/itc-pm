# Phase 2 Update Guide — SFB Motors + Panel PM + Schedule Fix

This update contains 4 big things. Total time to deploy: **~12 minutes**. Phone-friendly.

---

## What's new in Phase 2

### 1. 72 new SFB Biomass Boiler motors added
- All 72 motors auto-added under 4 sub-areas:
  - SFB · BIOMASS BOILER # 1 (20 motors)
  - SFB · BIOMASS BOILER # 2 (20 motors)
  - SFB · BIOMASS BOILER # 3 (20 motors)
  - SFB · COMMON MOTORS (12 motors)
- **New frequency rule (SFB only):**
  - Category A → BM (Bimonthly, 6 PMs/year)
  - Category B → Q (Quarterly, 4 PMs/year)
  - Category C → HY (Half-yearly, 2 PMs/year)
- Other areas keep their existing rule (A/B → Q, C → HY, Fire Pump → BM)
- **Total motors: 346** (was 274)

### 2. Scheduling fixed — 4 motors/day, same area, different dates
Old behavior: all 24 motors due in Week 1 showed the same date (01-Apr-2026).
New behavior:
- **4 motors per day** × 5 working days = 20-24/week capacity
- **All 4 motors on a given day must be from the same area** (grouped)
- Different areas get different days within the same week
- Specific dates: 4 on 01-Apr, next 4 on 02-Apr, next 4 on 03-Apr...

### 3. Planned date is now editable
- In Daily View, the planned date is now **clickable** (dotted underline)
- Click any planned date → small popup → pick new date → save
- Admin can shift any motor any time. Users can also shift, but only forward (admin override needed for backward shift beyond 2 reschedules)
- All shifts logged to Reschedule history

### 4. Panel PM Module is LIVE
- 283 panels across 6 units (Biscuit / Snacks / Noodles / Soap / CLS / TALC)
- Each panel has a fixed yearly PM date from your Excel sheet
- Same features as Motor PM: checklist, GPS, Mark Done, planned-date shift, filters, CSV export
- Separate `panel-pm.html` page, accessible from the Panel PM tab in app.html

---

## What changed in your files

| File | Change | Action |
|---|---|---|
| `motor-pm.html` | 72 SFB motors added, scheduler rewritten, planned-date editable | **REPLACE** |
| `panel-pm.html` | **NEW file** — Panel PM page with 283 panels | **ADD NEW** |
| `app.html` | Panel PM tab enabled (no longer "coming soon") | **REPLACE** |
| `index.html` | No change | Keep |
| `firebase-config.js` | No change | Keep |
| `firestore.rules` | No change | Keep |

**No Firebase Console changes needed.** Your existing setup works as-is.

---

## STEP-BY-STEP DEPLOY (phone-friendly, 12 min)

### Step 1 — Replace `motor-pm.html` on GitHub

1. Open browser on phone → **github.com** → sign in
2. Your profile (top right) → **Your repositories** → tap your repo (e.g. `itc-pm`)
3. Tap **motor-pm.html**
4. Tap pencil ✏️ icon (top right of file viewer)
   - If you can't see the pencil on mobile: browser menu (⋮) → toggle "Desktop site" → pencil now visible
5. **Inside the editor**, tap & hold → **Select all** → **Delete**
6. Now open the new `motor-pm.html` from the downloaded bundle (in a text app or browser)
7. **Select all → Copy** the new content
8. Back in GitHub editor → **Paste**
9. Scroll to bottom → commit message: `Phase 2: SFB motors + scheduler fix + editable dates`
10. Tap green **Commit changes** button

### Step 2 — Add the NEW `panel-pm.html` file

1. On your GitHub repo page, tap **Add file** → **Create new file**
   - On mobile, this menu is sometimes under the ⋮ icon next to the "Code" button
2. In the filename box at the top, type exactly: `panel-pm.html`
3. Open the new `panel-pm.html` from the bundle → select all → copy
4. **Paste** into the GitHub editor
5. Scroll to bottom → commit message: `Add Panel PM module`
6. Tap green **Commit new file** button

### Step 3 — Replace `app.html`

1. Back to repo → tap **app.html**
2. Pencil ✏️ icon
3. Select all → Delete
4. Open new `app.html` from bundle → select all → copy
5. Paste in GitHub editor
6. Commit message: `Enable Panel PM tab`
7. Commit changes

### Step 4 — Wait 2 minutes & hard refresh

1. Wait **2 full minutes** for GitHub Pages to publish
2. Open your live URL: `https://yourname.github.io/itc-pm/`
3. **Hard refresh**: close the browser tab fully, reopen the page, sign in fresh

### Step 5 — Verify everything works

**A. SFB motors are visible**
- Sidebar → **Motor Master**
- Search for "SFB" or scroll to bottom — you should see 72 new motors with area names starting with "SFB ·"

**B. Schedule shows specific dates per day**
- Sidebar → **Daily View** → set window to "This Month"
- You should see 4 motors per date (e.g. 4 on 01-Apr, 4 on 02-Apr, 4 on 03-Apr...)
- All 4 motors on the same date should be from the same area
- Click on any date — popup opens to shift planned date

**C. Panel PM tab works**
- Top tab bar → **Panel PM Module** (badge should say "LIVE" not "SOON")
- Click it → Panel PM dashboard opens
- Shows ~283 panels grouped by 6 units
- Try filtering by Unit and Month
- Click "Mark Done" on any panel → checklist popup opens

**D. Test Mark Done flow on a panel**
- Click "Mark Done" → fill checklist → save
- Panel should turn green (DONE status)
- Refresh page — done status persists (saved to Firebase)

---

## IMPORTANT: After deploying, regenerate the schedule

The new SFB motors and new scheduler logic need a fresh schedule generation:

1. Motor PM → sidebar → **Manage Data**
2. Click **↻ Regenerate Schedule**
3. Confirm
4. Daily View will now show the new layout (4 motors/day, same-area grouping, specific dates)

If you don't do this step, the old saved schedule (without SFB motors) will keep showing.

**Note:** This will reset planned dates back to algorithm output. If you've already shifted dates manually using the new feature, do this BEFORE making manual shifts, or your manual shifts will be lost.

---

## Frequency Rules — Quick Reference

| Area type | Category | Frequency | PMs/year |
|---|---|---|---|
| Fire Pump House (Phase-1, Phase-2) | A | BM | 6 |
| **SFB Biomass Boiler (NEW)** | **A** | **BM** | **6** |
| **SFB Biomass Boiler (NEW)** | **B** | **Q** | **4** |
| **SFB Biomass Boiler (NEW)** | **C** | **HY** | **2** |
| All other areas | A or B | Q | 4 |
| All other areas | C | HY | 2 |

---

## Schedule Capacity

- **20-24 motors per week** capacity (was 20)
- **4 motors per day** (Mon-Fri, 5 days)
- All 4 same-day motors must be from same area
- Different areas across different days within the same week

**Why 24 not 20?** Total motors went from 274 → 346 = 27% more workload. Some weeks will hit 24. The scheduler shifts overflow to earlier weeks automatically.

---

## Panel PM — Quick Tour

**Where:** app.html → **Panel PM Module** tab (top, next to Motor PM)

**What it does:**
- Same dashboard look as Motor PM, but for 283 electrical panels
- Each panel has ONE planned PM date per year (from your Excel sheet)
- Mark Done, checklist (8 panel-specific fields), GPS capture, planned-date shift — all the same as motors

**Default checklist for panels:**
- PI Value (number)
- IR Value MΩ (number)
- Busbar Torque Check (Pass/Fail)
- Cable Termination (Good/Loose/Damaged)
- Thermal Scan Hot Spots (None/Minor/Major)
- Breaker Operation (OK/Issue Found)
- Meter Calibration Check (OK/Out of Range)
- Panel Cleaning (Done/Pending)
- Observation/Remarks (text)

Admin can add/remove/edit fields just like Motor PM — but currently only via motor-pm.html's "Checklist Config" page. The Panel module reads the same shared checklist for now.

**Export Panel PM data:**
- Top of Panel PM page → **⤓ Export CSV** button

---

## Troubleshooting

**SFB motors don't appear in Motor Master after deploying:**
- Did you hard-refresh? Close all browser tabs, reopen.
- Did the migration run? Go to Manage Data → Regenerate Schedule once.

**Daily View still shows all motors on same date:**
- Same — need to Regenerate Schedule once after deploy (Step 5 above).

**Planned date is not clickable / no popup:**
- Hard refresh needed.

**Panel PM tab still says "SOON":**
- app.html wasn't replaced. Repeat Step 3.

**Panel PM tab shows blank page:**
- panel-pm.html missing. Repeat Step 2 (Add file).

**Two tabs show same content / Panel PM iframe shows Motor PM:**
- panel-pm.html upload was incomplete or named wrong. Check the file in your repo is exactly named `panel-pm.html` (lowercase, dash, .html).

**"Mark Done" works on motors but not on panels:**
- Make sure you're signed in. Panel PM uses the same Firebase auth as Motor PM.

---

## Rollback (if something goes wrong)

For each file (motor-pm.html, app.html):
1. GitHub → file → **History** link
2. Find the previous commit (before this update)
3. Click the "..." menu → **Revert this commit**

For `panel-pm.html` (the new file):
1. GitHub → panel-pm.html → ⋮ menu → **Delete file**
2. Commit the deletion

Your Firebase data is untouched by rollback — only the front-end files change.

---

## What's coming in Phase 3 (later)

- Automated email to area owners (Cloudflare Worker + Gmail, free)
- Panel-specific area owners separate from motor area owners
- Panel-specific checklist config (currently shared with motors)
- Bulk import of new panels/motors via CSV upload

Use Phase 2 for a couple of weeks first to settle in, then we'll plan Phase 3.
