# ITC COT PM — Phase 3 Update Guide

**What's new in this version:**

1. ✅ **Motor PM** — SFB Biomass Boiler motors (72 motors) now auto-appear for existing users. No reset needed.
2. ✅ **Panel PM** — Rebuilt as a full module: Overview dashboard, multi-chart analytics, Compliance page, Daily View, Schedule matrix, MTTR/MTBF, Excel/CSV template upload, Checklist Config.
3. ✅ **Panel PM** — Role-based access. Admin = full rights. User = limited (mark done only, can't delete or edit checklist).
4. ✅ **Panel PM** — "Back to Modules" link removed.
5. ✅ **NEW Complaint module** — Tab in main app. Log issues with start/stop time, auto-downtime calc. Admin manages area dropdown.

---

## How to deploy (mobile, 5 minutes)

### Step 1 · Open GitHub on your phone

Go to **github.com** → log in → open your repo (the one with the existing files).

### Step 2 · Replace 4 files & add 1 new file

You will replace these and add one:

**Replace** (overwrites existing — go into each, tap pencil ✏ icon, paste new content, "Commit changes"):
- `motor-pm.html` ← updated (auto-merges SFB motors)
- `panel-pm.html` ← rebuilt with all features
- `app.html` ← adds Complaints tab

**Add** (new file — tap "Add file" → "Create new file" → name it, paste, commit):
- `complaint.html` ← brand new

**Delete** (no longer needed):
- `panel-pm.html` (the old one is replaced — same filename, just overwrite)

### Step 3 · Wait 1 minute for GitHub Pages to rebuild

It auto-deploys. You'll see a green ✓ next to your latest commit when ready.

### Step 4 · Open your live site, sign in

You should see **3 tabs** now at the top: Motor PM · Panel PM · **Complaints (NEW)**

---

## What changed in each file

### `motor-pm.html`
- Added auto-merge: every page load, compares your saved motor list with the bundled defaults and silently adds any new motors (like the 72 SFB ones from Phase 2 if they didn't show up).
- Added default Panel PM checklist fields (9 fields like PI Value, IR Value, Busbar Torque, etc.) — used by panel-pm.html.
- Added default Complaint Areas (30 areas) — used by complaint.html.

### `panel-pm.html` (full rebuild)
- 8 pages: Overview · Daily View · Schedule · Compliance · Panel Master · Execution Log · Checklist Config (admin) · Import/Export (admin)
- 5 charts: Status doughnut, Top units bar, Monthly workload, Cumulative trend line, MTTR by unit
- 283 panels pre-loaded across 6 units (Biscuit, Snacks, Noodles, Soap, CLS, TALC)
- Mark Done modal with full checklist + GPS capture
- Click any date → reschedule modal
- CSV/Excel template upload for bulk add/update
- Role-based: admin has all 8 pages; user sees 6 (no Config / no Import)
- "Back to Modules" link **removed**

### `app.html`
- Added 3rd tab: "Complaints" with NEW badge
- Lazy-loads complaint.html in iframe on first click

### `complaint.html` (new file)
- Form: Area (dropdown), Issue (textarea), Start time, Stop time, Attended By, Action Taken
- Auto-calculates downtime in minutes (or hours if >60m)
- Stop time blank = "ongoing" (status: open)
- Both admin & user can log complaints
- **Admin only**: add/remove Areas, edit/delete complaints
- Filters: by Area, by Status, by Issue text
- Export CSV button

---

## Verification checklist (after deploy)

Open your live site and check:

- [ ] Sign in as admin → see 3 tabs (Motor / Panel / Complaints)
- [ ] **Motor PM** tab → scroll through master list → SFB Biomass Boiler motors visible (Sr 275-346)
- [ ] **Panel PM** tab → Overview shows charts, KPI tiles, 283 panels
- [ ] **Panel PM** → click "Daily View" → panels listed
- [ ] **Panel PM** → click any date in Daily View → reschedule modal opens
- [ ] **Panel PM** → click "Mark Done" → checklist modal opens with 9 fields + GPS
- [ ] **Panel PM** → "Checklist Config" and "Import/Export" pages visible (admin only)
- [ ] **Complaints** → form visible → "Manage Areas" card visible (admin only)
- [ ] Sign in as user → "Checklist Config", "Import/Export" hidden; "Manage Areas" hidden in Complaints

---

## Tips

- **Excel upload format**: 3 columns (Unit, Panel Name, PM Date YYYY-MM-DD). Existing panels matched by Unit+Name are updated; new rows added.
- **Reschedules**: kept separately from motor reschedules in Firebase (type:'panel' flag) — both modules' history is preserved.
- **Default areas** in Complaints include all motor and panel areas. Admin can add custom ones (e.g. "CHP House", "Specific Pump Room") via the Manage Areas card.
- **Downtime**: any open complaint can be closed later by admin editing it (form pre-fills, set Stop Time, re-submit).

Made with care for ITC Haridwar Utilities · Phase 3
