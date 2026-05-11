# ITC Haridwar COT PM Module

Web-based preventive maintenance command centre for ITC Haridwar utilities. Login-protected, multi-user, multi-FY, with shared cloud storage.

## Quick start

See **[HOSTING_GUIDE.md](./HOSTING_GUIDE.md)** for the full step-by-step setup (30–45 min).

Short version:
1. Create a Firebase project, enable Email/Password auth + Firestore
2. Upload these files to a GitHub repo, enable Pages
3. Paste your Firebase config into `firebase-config.js`
4. Authorize your `*.github.io` domain in Firebase
5. Open the URL, create an account, sign in

## Features

- Login screen with email/password authentication
- Two-tab layout: Motor PM (live), Panel PM (placeholder for future)
- 274 motors, 25 areas, 52-week schedule with BM/Q/HY frequency rules
- Compliance dashboard with FY/Month/Area filters
- Mark PMs done one-by-one OR bulk upload via CSV/Excel
- Add/remove/edit motors — schedule auto-regenerates
- Forward year planning — generate FY27-28, FY28-29, etc. with one click
- Real-time sync across all signed-in users (Firestore)
- Works offline (localStorage cache), syncs on reconnect

## Files

- `index.html` — Login page
- `app.html` — Tab shell (Motor PM / Panel PM)
- `motor-pm.html` — The full dashboard
- `firebase-config.js` — Firebase credentials (you fill in)
- `firestore.rules` — Reference copy of security rules
- `HOSTING_GUIDE.md` — Setup walkthrough

## Built for

ITC Haridwar utilities team — substation, HVAC, WTP, fire pumps, boilers, ETP.
Capacity model: 4 motors/day × 5 days = 20 motors/week.
