# ITC Haridwar COT PM Module — Hosting Guide

This guide walks you through hosting the PM Module on **GitHub Pages** (free) with **Firebase** for login and shared data storage. Total time: **30–45 minutes**. No coding required — just clicks and copy-paste.

---

## What you'll get

- A live URL like `https://yourname.github.io/itc-pm/` accessible from any device
- A login screen — only your team can sign in
- Two tabs: **Motor PM Module** (active) and **Panel PM Module** (placeholder for future)
- All data (executions, motor edits, FY plans) saved in the cloud — when one user marks a PM done, everyone sees it instantly
- Free forever for your scale (Firebase free tier covers ~50,000 reads + 20,000 writes per day, way more than this app needs)

---

## Part A — Set up Firebase (15 minutes)

Firebase handles the **login** and **shared database**.

### A1. Create a Firebase project

1. Go to **https://console.firebase.google.com/**
2. Sign in with a Google account (use a work or personal Gmail)
3. Click **Add project**
4. Project name: `itc-pm` (or anything you like). Click **Continue**
5. **Disable Google Analytics** when prompted (you don't need it). Click **Create project**
6. Wait ~30 seconds. Click **Continue** when ready

### A2. Register your web app with Firebase

1. On the Firebase project home page, click the **Web icon** (looks like `</>`)
2. App nickname: `itc-pm-web`
3. **Do NOT tick** "Set up Firebase Hosting" (we're using GitHub Pages instead)
4. Click **Register app**
5. You'll see a code block with `const firebaseConfig = { ... }`. **Copy this whole object**. You'll paste it in step C2.
6. Click **Continue to console**

### A3. Enable Email/Password authentication

1. In the left sidebar, click **Build → Authentication**
2. Click **Get started**
3. Under "Sign-in providers", click **Email/Password**
4. Toggle **Enable** ON for "Email/Password" (leave "Email link" off)
5. Click **Save**

### A4. Create the Firestore database

1. In the left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll add proper rules in step A5)
4. For location, pick the one nearest to Haridwar — `asia-south1 (Mumbai)` is best
5. Click **Create**. Wait ~30 seconds.

### A5. Set Firestore security rules

1. Still in Firestore, click the **Rules** tab at the top
2. **Replace** all the text in the editor with this:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /itc_pm/{docId} {
         allow read, write: if request.auth != null;
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

3. Click **Publish**. This means: only signed-in users can read/write the PM data.

### A6. Add authorized users

You can either let people sign themselves up (the login page has a "Create account" link) or pre-create accounts:

**Option 1 — open signup (default):** Anyone with the URL can create an account. Simpler.

**Option 2 — restricted (recommended for production):**
1. Go to **Authentication → Settings → User actions**
2. Untick **Enable create (sign-up)**
3. Click **Save**
4. Now create accounts manually: **Authentication → Users → Add user** — enter email + password for each team member

✅ Firebase is ready. Keep the browser tab open.

---

## Part B — Set up GitHub (10 minutes)

GitHub will host the static files for free.

### B1. Create a GitHub account (skip if you already have one)

1. Go to **https://github.com/signup**
2. Pick a username (this becomes part of your URL)
3. Verify email

### B2. Create a new repository

1. After signing in, click the **+** in the top right → **New repository**
2. Repository name: `itc-pm` (or anything — it becomes part of the URL)
3. Set to **Public** (required for free GitHub Pages). Code-wise nothing sensitive is in these files; security is enforced by Firebase auth rules.
4. **Tick** "Add a README file"
5. Click **Create repository**

### B3. Upload the PM module files

1. On the repo page, click **Add file → Upload files**
2. Drag **all six files** from the bundle into the upload area:
   - `index.html`
   - `app.html`
   - `motor-pm.html`
   - `firebase-config.js`
   - `firestore.rules`
   - `README.md`
3. Scroll down. Commit message: "Initial upload"
4. Click **Commit changes**

### B4. Enable GitHub Pages

1. In the repo, click **Settings** (top right)
2. In the left sidebar, click **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
4. Click **Save**
5. Wait 1–2 minutes. Refresh the page. You'll see a green box saying:
   > Your site is live at **https://yourname.github.io/itc-pm/**

Copy that URL — that's your app.

---

## Part C — Connect Firebase to your hosted app (5 minutes)

Right now your hosted app has placeholder Firebase credentials. You need to paste in the real ones from step A2.

### C1. Open `firebase-config.js` in GitHub

1. In your repo, click **firebase-config.js**
2. Click the **pencil icon** (top right of the file viewer) to edit

### C2. Paste your Firebase config

Replace the contents with this, using the values from step **A2**:

```javascript
export const firebaseConfig = {
  apiKey: "AIza...your-real-key...",
  authDomain: "itc-pm.firebaseapp.com",
  projectId: "itc-pm",
  storageBucket: "itc-pm.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

(Just replace the placeholder strings with the values from your Firebase config object.)

3. Scroll down. Click **Commit changes**.
4. Wait ~1 minute for GitHub Pages to redeploy.

### C3. Authorize your domain in Firebase

Firebase blocks logins from unknown domains by default. Add yours:

1. Go back to Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Enter: `yourname.github.io` (just the domain — no `https://`, no paths)
4. Click **Add**

✅ All connected.

---

## Part D — First sign-in (2 minutes)

1. Open your URL: `https://yourname.github.io/itc-pm/`
2. You'll see the login screen
3. Click **"Create an account"**
4. Enter your name, email, password (6+ characters)
5. Click **Create Account**
6. You'll land in the app, with the **Motor PM Module** active in the first tab

🎉 **Done.** Bookmark the URL. Share it with your team.

---

## How it works (one-paragraph summary)

When someone signs in, the dashboard reads the latest state from Firestore. When they mark a PM done, edit a motor, or add a future FY, the change is saved to Firestore (cloud) and broadcast to anyone else who has the page open. Behind the scenes there's also a localStorage cache so the app loads instantly even on slow connections, and works offline (changes sync when reconnected).

---

## When you're ready to add the Panel PM Module

1. Build the Panel PM dashboard (similar structure — copy `motor-pm.html` as a template, change motor → panel)
2. Save it as `panel-pm.html` in the repo
3. Edit `app.html` — find the line:
   ```html
   <div class="tab" data-tab="panel">...
   ```
   and below the placeholder `<section id="pane-panel">`, replace the placeholder content with:
   ```html
   <iframe src="./panel-pm.html" id="panel-frame"></iframe>
   ```
4. Commit. Done.

---

## Troubleshooting

**"This page didn't load Google Maps correctly" — wait, that's Maps, not us. Skip.**

**Login spins forever:**
- Check the browser console (F12 → Console). Common causes:
  - `firebase-config.js` still has placeholder values — go back to step C2
  - Domain not authorized — go back to step C3
  - Email/Password sign-in not enabled — step A3

**"Permission denied" when saving:**
- Firestore rules not published — step A5
- User not signed in — try logging out and back in

**Changes don't sync between devices:**
- Both devices must be signed in with **valid** accounts (not anonymous)
- Firestore quota hit — extremely unlikely at this scale, but check **Usage** tab in Firebase Console

**Want to reset everything:**
- In Firebase Console → Firestore → delete the `itc_pm` collection
- Reload the page; the app rebuilds from defaults

---

## Costs

- **GitHub Pages:** free, forever, for public repos
- **Firebase free tier (Spark plan):**
  - Authentication: free for first 50,000 monthly active users
  - Firestore: 50K reads + 20K writes + 20K deletes per day, 1 GiB storage
  - You'll use ~100 reads and ~10 writes per day for a 5-person team. **You will not hit the limits.**

If you ever exceed the free tier, Firebase will email you and **NOT charge automatically** — you have to manually upgrade to the Blaze plan. Safe.

---

## Security notes

- The `firebase-config.js` file is **safe to be public** — its API key is a public web key, not a secret. Real security comes from the Firestore rules + Authentication, both of which require a signed-in user.
- All data is stored in Firestore with TLS encryption in transit and at rest.
- To remove a user's access: Firebase Console → Authentication → Users → find them → ⋮ → Delete user.
- To export all data for backup: in the app, Manage Data tab → "Backup Everything" downloads a JSON file.

---

## File reference

| File | Purpose | Edit when |
|---|---|---|
| `index.html` | Login screen | Almost never |
| `app.html` | Tab shell with Motor PM / Panel PM | When adding Panel PM |
| `motor-pm.html` | The actual dashboard (all features) | When adding new features to motor module |
| `firebase-config.js` | Firebase credentials | Once during setup (step C2) |
| `firestore.rules` | Reference copy of security rules | When changing security model |
| `README.md` | This file | Documentation only |
