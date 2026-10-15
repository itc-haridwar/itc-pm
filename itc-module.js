/* ═══ ITC Haridwar Utilities · shared module plumbing (4.0) ═══════════════════════════════════════════════════════
   One file, used by every module page on this site (WTP, ETP, Electrical, Boiler, Steam, SOP, HVAC, and any new one).
   It gives a module three things, all from the SAME Firebase project as the PM module:
     1. Sign-in guard  — not signed in → sent to the home page (index.html) and brought straight back after sign-in.
     2. Who is it      — M.user (Firebase user), M.admin (true if admins/<uid> exists, same rule as the PM module).
     3. Store          — the module's own documents in collection itc_pm, always named <prefix>_<name>
                         (e.g. wtp_log_2026_10). Your Firestore rules already allow itc_pm for signed-in users, so a
                         new module never needs a rules change, and it can never overwrite a PM document.

   USE IN A MODULE PAGE (e.g. boiler.html, in the same folder as index.html and firebase-config.js):
     in <head>      <style>html:not(.itc-ok) body{visibility:hidden}</style>      ← optional: page stays hidden until signed in
     before </body> <script type="module">
                      import { startModule } from './itc-module.js';              ← a page inside a folder: '../itc-module.js'
                      const M = await startModule({ prefix: 'boiler', homeButton: true });
                      // M.user.email · M.admin · await M.Store.read('settings') · await M.Store.merge('settings', {target: 95})
                      // M.Store.live('log_2026_10', data => { ... }) · await M.Store.removeKey('log_2026_10', 'days', 'd2026_10_15')
                    </script>

   Do not put firebase-config.js inside this file; it is imported from the live copy that is already on the site. */
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, deleteField } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const VERSION = '4.0';
export const COLLECTION = 'itc_pm';
// names the PM module already uses inside itc_pm — a new module may not take them as its prefix
export const RESERVED = ['shared', 'pm', 'aic', 'passport', 'scandata', 'scanidx', 'motor', 'panel', 'complaint', 'admins', 'itc'];
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const fs = { doc, getDoc, setDoc, onSnapshot, deleteField };
// the site's top folder = where this file lives (works for tc-haridwar.github.io/ and for …github.io/<repo>/)
export const ROOT = new URL('./', import.meta.url);
export const HOME = new URL('index.html', ROOT).href;
// this page's address relative to the top folder: 'wtp.html' or 'boiler/index.html'
export function pagePath(){
  const here = new URL(location.href);
  return decodeURIComponent(here.pathname.startsWith(ROOT.pathname) ? here.pathname.slice(ROOT.pathname.length) : here.pathname.split('/').pop()) || 'index.html';
}

const NAME = /^[A-Za-z0-9_-]{1,100}$/;
export function makeStore(prefix, who){
  const id = name => { if(!NAME.test(String(name))) throw new Error('Store: bad document name "' + name + '" (letters, digits, _ and - only)'); return prefix + '_' + name; };
  const ref = name => doc(db, COLLECTION, id(name));
  const stamp = () => ({ updatedAt: new Date().toISOString(), updatedBy: (who() || {}).email || '' });
  return {
    prefix,
    id,
    ref,
    /** read once → the document's data, or null if it does not exist yet */
    read: async name => { const s = await getDoc(ref(name)); return s.exists() ? s.data() : null; },
    /** write: merges into the document (creates it if needed). Nested maps merge too, so two people saving
        different days of the same month never overwrite each other. */
    merge: (name, data) => setDoc(ref(name), Object.assign({ module: prefix }, stamp(), data), { merge: true }),
    /** remove one entry from a map field, e.g. removeKey('log_2026_10', 'days', 'd2026_10_15') */
    removeKey: (name, field, key) => setDoc(ref(name), Object.assign({ [field]: { [key]: deleteField() } }, stamp()), { merge: true }),
    /** live updates: cb(data or null) now and on every change; returns a function that stops listening */
    live: (name, cb, onError) => onSnapshot(ref(name), s => cb(s.exists() ? s.data() : null), e => { (onError || console.error)(e); })
  };
}

export function homeButton(){
  if(document.getElementById('itc-home-fab')) return;
  const a = document.createElement('a');
  a.id = 'itc-home-fab'; a.href = HOME; a.textContent = '⌂ All modules'; a.title = 'Utilities Command Centre — all modules';
  a.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483000;padding:9px 13px;border-radius:999px;font:700 11px/1 Inter,system-ui,sans-serif;letter-spacing:1px;' +
    'text-transform:uppercase;text-decoration:none;color:#e8ecf3;background:rgba(10,16,30,.82);border:1px solid rgba(0,217,255,.45);box-shadow:0 8px 24px -10px rgba(0,0,0,.9),0 0 14px -6px #00d9ff;' +
    '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)';
  (document.body || document.documentElement).appendChild(a);
}

/** startModule({prefix, homeButton?}) → resolves with M once the user is signed in.
    If nobody is signed in it sends the browser to the home page (index.html?next=<this page>) and never resolves. */
export function startModule(opts){
  opts = opts || {};
  const prefix = String(opts.prefix || '').toLowerCase();
  if(!/^[a-z][a-z0-9]{1,15}$/.test(prefix) || RESERVED.includes(prefix))
    return Promise.reject(new Error('itc-module: prefix "' + prefix + '" is not allowed — use 2–16 lower-case letters/digits that the PM module does not use'));
  const file = pagePath();
  return new Promise(resolve => {
    let user = null, done = false;
    onAuthStateChanged(auth, async u => {
      if(!u){ location.replace(HOME + '?next=' + encodeURIComponent(file)); return; }
      user = u;
      if(done) return; done = true;
      let admin = false;
      try{ admin = (await getDoc(doc(db, 'admins', u.uid))).exists(); }catch(e){ admin = false; }
      const M = { version: VERSION, prefix, file, home: HOME, user: u, admin, app, auth, db, fs,
        Store: makeStore(prefix, () => user),
        signOut: async () => { await signOut(auth); location.replace(HOME); } };
      if(opts.homeButton){ if(document.body) homeButton(); else addEventListener('DOMContentLoaded', homeButton); }
      document.documentElement.classList.add('itc-ok');
      window.__itcModule = M;
      resolve(M);
    });
  });
}
