# ITC Haridwar Utilities — Phase 4.0 · One home page for every module

| You asked | What 4.0 does |
|---|---|
| **One main page with 8 modules** | `index.html` is now the **Utilities Command Centre**. It has 8 glass tiles in your order: 01 Electrical (solar + RAW + power trading & wheeling), 02 WTP, 03 ETP, 04 Boiler learning & performance, 05 Steam, 06 SOP & SWP, 07 HVAC learning & performance, 08 Preventive Maintenance (**LIVE**). The same 3D engineering showreel as the PM sign-in runs behind the tiles. |
| **Each tile opens its own module section** | Each tile opens its own page, e.g. `wtp.html` or `etp.html`. **Tile 08 opens the PM sign-in page.** That page moved from `index.html` to `pm-login.html`. If you are already signed in, it goes straight into the PM app as before. |
| **How to start with the modules you already have** | Section 3 below: a 3-line hook-up, plus what to send me for each module. |
| **Same GitHub + same Firebase for many modules** | Section 1 below. One site, one `firebase-config.js`, one sign-in, one set of rules. Each module keeps its own data area. **No Firestore rules change, no Firebase console change.** |

What the tiles do:

- **Tile not uploaded yet:** shows **Coming soon**. Tapping it tells you which file to upload.
- **Tile file uploaded:** turns **Ready** by itself.
- **Signed out:** tapping a tile asks for sign-in right on the home page, then opens that module.
- **PM app header:** now has **⌂ All modules** to get back to the home page.

---

## 1 · How one GitHub site + one Firebase serves every module

```
tc-haridwar.github.io/            (your existing repository — same folder for everything)
├─ index.html              ← NEW  home page: 8 tiles (Utilities Command Centre)
├─ pm-login.html           ← NEW  PM sign-in (this was index.html)
├─ app.html, motor-pm.html, panel-pm.html, complaint.html,
│  asset-integrity.html, passport.html      ← PM module (only the sign-in links changed)
├─ itc-module.js           ← NEW  shared plumbing every new module uses (sign-in guard + data store)
├─ electrical.html  wtp.html  etp.html  boiler.html  steam.html  sop.html  hvac.html   ← one file per module
└─ firebase-config.js      ← your live keys — stays as it is, never replaced
```

| | Shared by all modules | Separate for each module |
|---|---|---|
| GitHub | One repository, same folder, same address | One HTML file each, or one folder each for a bigger module |
| Firebase project | The same `firebase-config.js` (already on GitHub) | — |
| Sign-in | **One account and one sign-in for everything.** Firebase keeps you signed in per web address, so signing in on any page signs you in on all of them. | — |
| Admins | The same `admins` list in Firestore (you are already there) | Each module decides what admins can do extra |
| Firestore rules | The same rule on `itc_pm`. **Nothing to change.** | — |
| Data | Collection `itc_pm` | Its own document names, always starting with its **prefix** (table below). A module can never overwrite a PM document. `itc-module.js` refuses PM names. |

### Data areas (prefixes)

| Module | File | Prefix | Example documents |
|---|---|---|---|
| Electrical | `electrical.html` | `elec_` | `elec_log_2026_10` (daily log, Oct 2026) |
| WTP | `wtp.html` | `wtp_` | `wtp_log_2026_10` |
| ETP | `etp.html` | `etp_` | `etp_log_2026_10` |
| Boiler | `boiler.html` | `boiler_` | `boiler_log_2026_10` |
| Steam | `steam.html` | `steam_` | `steam_log_2026_10` |
| SOP & SWP | `sop.html` | `sop_` | `sop_register` |
| HVAC | `hvac.html` | `hvac_` | `hvac_log_2026_10` |
| PM (existing, untouched) | `app.html` + 5 modules | reserved | `shared_state`, `pm_audit`, `aic_…`, `passport_…`, `scanidx_…`, `scandata_…` |

### Size and free-plan limits (Firebase Spark, free)

| Limit | Value | What we do |
|---|---|---|
| One document | max **1 MB** | **One document per module per month.** One day's entry is about 0.3 KB, so a month is about 10 KB. A register holds about 2,000 procedures per document. |
| Stored data | **1 GiB** free | Logs from all 7 modules for 10 years come to well under 100 MB |
| Reads | **50,000 / day** free | Opening a module reads 1–2 documents |
| Writes / deletes | **20,000 / day** each | One save = one write |
| Download | 10 GiB / month | Pages come from GitHub, not Firebase |
| **File storage (PDFs, photos)** | Firebase Storage needs the paid Blaze plan since 3 Feb 2026 | **SOP files:** keep the PDF on Google Drive / SharePoint with restricted sharing, and save its link in the SOP register (that is what the starter does). Do **not** put SOP PDFs in the GitHub repository, because anything on GitHub Pages is public. Small PDFs can later be stored inside Firestore in pieces, the same way the PM attachments are, if you want them private and free. |

**Two honest security notes**

| Note | Detail |
|---|---|
| Public vs protected | GitHub Pages is public. Anyone can open the HTML code, and so can see anything typed *into* an HTML file. Data saved through Firebase is protected by sign-in. So keep plant figures in Firebase, not inside the HTML. |
| Who can sign in | Today anyone can create an account from the sign-in page, and any signed-in account can read and write `itc_pm`. This is the same as the live PM module. It is safe while the address stays internal. If you want only approved people, tell me. It is one change to the rules, done once for all modules. Not needed for 4.0. |

---

## 2 · Upload (phone, about 5 minutes)

### Commit 1 — required. Upload these 9 files together

| Step | Do this |
|---|---|
| 1 | Open your GitHub repository in the phone browser (desktop site on). |
| 2 | Unzip `itc-pm-phase4_0-bundle.zip`, then open the folder **`1_upload_now`**. |
| 3 | On GitHub, tap **Add file → Upload files** and pick **all 9 files**: `index.html`, `pm-login.html`, `app.html`, `motor-pm.html`, `panel-pm.html`, `complaint.html`, `asset-integrity.html`, `passport.html`, `itc-module.js`. |
| 4 | **Do NOT upload `firebase-config.js`.** Your live copy has the real keys. The zip does not contain it. |
| 5 | Commit message: `Phase 4.0 Utilities Command Centre home page` → **Commit changes**. |
| 6 | Wait 1–2 minutes, open `https://tc-haridwar.github.io/`, then pull down to refresh. |

Upload all 9 in **one commit**. The PM pages now send signed-out users to `pm-login.html`, so that file must arrive with them.

| File | GitHub must show | What you see |
|---|---|---|
| `index.html` | **1139 lines** | Home page with 8 tiles. 7 say **Coming soon** until you upload the starters; PM says **● LIVE** |
| `pm-login.html` | **2137 lines** | PM sign-in (same page as before) with **← All modules** at the bottom |
| `app.html` | **3128 lines** | **⌂ All modules** button next to Sign Out |
| `motor-pm.html` | **8790 lines** | Same as 3.22 (one more line than before: a final line break) |
| `panel-pm.html` | **6173 lines** | Same as 3.22 |
| `complaint.html` | **3323 lines** | Same as 3.22 |
| `asset-integrity.html` | **3826 lines** | Same as 3.22 |
| `passport.html` | **4051 lines** | Same as 3.22 |
| `itc-module.js` | **98 lines** | (nothing visible: shared plumbing) |

**Check:**

1. Tap tile 08 → PM sign-in → PM app.
2. Tap **⌂ All modules** → back to the home page.
3. Home-screen shortcuts to `tc-haridwar.github.io` now open the home page. Shortcuts to `app.html` still work.

### Commit 2 — optional, any time: the 7 starter modules

The folder **`2_optional_starters`** has `electrical.html`, `wtp.html`, `etp.html`, `boiler.html`, `steam.html`, `sop.html` and `hvac.html`. Upload any of them, in the same way and to the same place, and that tile turns **Ready**. Each one is a working module from day one:

| Starter | What it does now |
|---|---|
| Electrical | Daily log: solar kWh, grid import (RAW) kWh, power traded kWh, power wheeled kWh, maximum demand kVA |
| WTP | Raw water in m³, treated water m³, RO recovery %, treated TDS ppm, chemicals kg |
| ETP | Inlet flow m³, inlet COD, outlet COD, BOD, TSS (mg/L), outlet pH |
| Boiler | Steam t, fuel t, steam/fuel ratio, feed water °C, efficiency % |
| Steam | Generation t, metered consumption t, T&D loss %, condensate return % |
| HVAC | Chiller kWh, TR·h, kW/TR, CHW supply °C |
| SOP & SWP | Register: doc no., title, area, type (SOP / SWP / work instruction / checklist), revision, Drive/PDF link |

Every log starter has:

- month selector;
- KPI tiles (month total / average / maximum);
- trend chart per field;
- entries table;
- **CSV** export.

Who can do what:

- Anyone signed in can add entries.
- Saving the same date again updates only the values you typed.
- Only the person who added an entry, or an admin, can delete it.

`module-template.html` is the master copy. Under any other name it opens a blank "New module", which you or I can set up.

**Starters are placeholders.** When your real module for that tile is ready, it simply replaces the starter file of the same name.

---

## 3 · Bringing in the modules you already have

### The 3-line hook-up

Any HTML module joins the site with three lines:

```html
<!-- in <head>: keeps the page hidden until the person is signed in -->
<style>html:not(.itc-ok) body{visibility:hidden}</style>

<!-- just before </body> -->
<script type="module">
  import { startModule } from './itc-module.js';
  const M = await startModule({ prefix: 'boiler', homeButton: true });
</script>
```

What the hook-up gives the module:

- **Not signed in:** the person goes to the home page, signs in once, and comes straight back.
- **⌂ All modules:** a floating button appears bottom-left.
- **`M.user`** (who is signed in) and **`M.admin`** (same admins list as PM).
- **`M.Store`** saves and reads that module's own Firebase documents:
  - `M.Store.merge('settings', {...})`
  - `M.Store.read('settings')`
  - `M.Store.live('log_2026_10', fn)`
  - `M.Store.removeKey(...)`

  They all land in `itc_pm/boiler_…`.

| Your ready module is… | Do this |
|---|---|
| **One HTML file with no login and no saved data** (dashboard, learning pages, calculator) | Rename it to the tile's file name (e.g. `boiler.html`), add the 3 lines and upload it. The Boiler tile opens it. Remember: figures typed *inside* the file are public. |
| **One HTML file that saves data in the browser** (localStorage) or in Excel | Send it to me. I move the saving to `M.Store`, so everyone sees the same data on any phone, protected by sign-in. |
| **A module that already uses Firebase** (its own config or another project) | Send it to me. It is switched to the shared `firebase-config.js` and to its `itc_pm/<prefix>_…` documents, so it uses the same sign-in and needs no rules change. A second Firebase project would need its own sign-in and its own rules. |
| **Several files** (HTML + JS + CSS + images) | Put them in a folder named after the module, e.g. `boiler/index.html`. In the hook-up, write `'../itc-module.js'`. Then change the tile's `file:` to `'boiler/index.html'` in the `MODULES` list at the top of `index.html`, or ask me. Tested. |

### What to send me for each module (one module per message works best)

| Send | Example |
|---|---|
| The file(s) as they are now | `boiler_dashboard.html` (attach it) |
| Which tile it belongs to | Tile 04 Boiler |
| Where the numbers come from | Typed daily by the shift engineer / Excel export from DCS / monthly bill |
| The KPIs and targets you report | SFR ≥ 4.2, efficiency ≥ 82 %, blow-down TDS ≤ 3,500 ppm |
| Who enters and who only views | Shift engineers enter; managers view; you (admin) edit settings |
| Any formula you use today | Efficiency by the indirect method, wheeling charges per kWh |

You get back each time:

- the converted file, already tested on phone and laptop;
- the GitHub line count;
- a short guide, the same as these updates.

### Adding a 9th module later

Add one line to the `MODULES` list at the top of `index.html`: name, file, prefix, colour. Pick a new prefix that is not in the table above. Or just ask me.

---

## 4 · Tests

| Test | Result |
|---|---|
| New 4.0 checks | **144 / 144**. Full list in the section after this table. |
| 3.22 checks on the 4.0 PM pages | Running at the time of sending: **101 / 101 passed so far**, 0 failures (motor, panel, complaints, asset integrity, passport, PM sign-in page). Final count to follow in chat. |
| 15 earlier test suites (effects in Lite) | **Same result as 3.22, check by check** (410 checks, both run the same day). The 41 that fail on the test bench fail on both builds alike; most are planner checks that depend on today's date. |
| Screens | Home page, PM app header and all 7 starters at 412 px (phone) and 1366 px (laptop): no page wider than the screen, 0 script errors |

**What the 144 checks cover**

- **Home page:** 8 tiles in your order; each opens its own file; PM tile → PM sign-in → PM app.
- **Tile status:** Coming soon ↔ Ready follows the files on GitHub.
- **Sign-in:**
  - tapping a tile while signed out asks for sign-in and then opens that module;
  - a module opened while signed out comes back after sign-in;
  - web addresses that point outside the site are ignored;
  - sign out works from the home page and from inside a module.
- **PM pages:** signed out → `pm-login.html`; **⌂ All modules** shows on phone and laptop.
- **Each of the 7 starters:**
  - saves to its own document only; all PM documents are byte-for-byte untouched;
  - KPI totals, averages and maximum are correct;
  - CSV export and month switch work;
  - re-saving a date keeps the other values;
  - entries survive a new session;
  - delete rights hold: own entries or admin only.
- **SOP register:**
  - only `https://` links are accepted;
  - text cannot run code;
  - links open in a new tab.
- **`itc-module.js`:**
  - refuses PM names as a prefix;
  - refuses bad document names;
  - gives a clear message if the file is missing.
- **Ready-module hook-up:** works both as a root file and inside a folder.
- **All screens:** no page wider than a phone, 0 script errors.

---

## 5 · If something looks wrong — rollback

| Problem | Do this |
|---|---|
| Home page not wanted yet | Upload the **3.22 `index.html`** again from `itc-pm-phase3_22-bundle.zip`. The PM sign-in is back at the site address. Leave the other 4.0 files: `pm-login.html` is the same sign-in page, so the PM pages keep working. |
| A starter module misbehaves | Delete that one file on GitHub. Its tile returns to **Coming soon**. Its data stays in Firebase. |
| A page stays on "Loading…" | `itc-module.js` is missing or misspelt on GitHub. The page says so after about 9 seconds. |

**Do NOT upload `firebase-config.js`** in any of these steps.
