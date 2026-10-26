# Cloud-Based Student Management System

A cloud-native web app (React + Firebase) with secure login and role-based
dashboards for Admin, Teacher, and Student. This is **Phase 1–3** of the
full project spec: project setup, authentication, and role-based routing.

## What's built so far

- React + Vite + TypeScript + Tailwind CSS frontend
- Firebase Authentication (email/password, password reset)
- Role stored in Firestore (`/users/{uid}`), never trusted from the client
- Protected, role-based routes (Admin / Teacher / Student can only see their
  own areas)
- Responsive sidebar layout with dark mode
- Admin, Teacher, and Student dashboards with placeholder stats/charts
- Firestore Security Rules (`firestore.rules`) and Storage Rules
  (`storage.rules`) enforcing the same access control server-side
- Demo data seed script (`scripts/seed.mjs`)

Everything else in the spec (attendance, marks, assignments, file storage,
notices, analytics, audit logs, Cloud Functions, Docker, deployment,
documentation) is **not built yet** — those are separate phases. Ask to
continue with any of them and I'll add it into this same project.

---

## 1. Prerequisites (install these once)

1. **Node.js** (v18 or newer) — download from https://nodejs.org
   Check it worked: `node -v`
2. A free **Google account** (for Firebase)
3. A code editor — **VS Code** is recommended: https://code.visualstudio.com

---

## 2. Create your Firebase project (one-time, ~5 minutes)

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it (e.g. `csms-demo`) → finish the wizard.
3. In the left sidebar: **Build → Authentication → Get started** → enable
   the **Email/Password** sign-in method.
4. In the left sidebar: **Build → Firestore Database → Create database** →
   start in **production mode** → choose a region close to you.
5. In the left sidebar: **Build → Storage → Get started** → keep defaults.
6. Go to **Project Settings (⚙️ icon) → General**, scroll to "Your apps",
   click the **</> (Web)** icon, register an app (any nickname), and copy
   the `firebaseConfig` values shown — you'll need them in step 4 below.

---

## 3. Get the project running on your computer

```bash
# 1. Unzip the project, then open a terminal inside the folder
cd csms

# 2. Install all dependencies (downloads packages, one-time)
npm install

# 3. Copy the environment template
cp .env.example .env
```

Now open `.env` in your editor and paste in the values from Firebase
step 6 above (each `VITE_FIREBASE_...` line). This file is already
git-ignored — it will never be committed or uploaded anywhere.

```bash
# 4. Start the app locally
npm run dev
```

Open the URL it prints (usually **http://localhost:5173**) in your
browser. You'll see the login page.

---

## 4. Create demo login accounts

The login page won't work until at least one user exists in both
Firebase Authentication **and** the Firestore `users` collection (that's
what stores the role). Easiest way — run the seed script:

1. Firebase Console → **Project Settings → Service Accounts** →
   **Generate new private key** → save the downloaded file as
   `scripts/serviceAccountKey.json` (this file is git-ignored, never
   share it).
2. Install the admin SDK once: `npm install firebase-admin`
3. Run: `node scripts/seed.mjs`

This creates three accounts, all with password `Demo@1234`:

| Role    | Email             |
|---------|-------------------|
| Admin   | admin@demo.com    |
| Teacher | teacher@demo.com  |
| Student | student@demo.com  |

Log in with any of these on the running app and you'll land on the
matching dashboard. **Change this password before any real deployment.**

---

## 5. Deploy your Firestore/Storage security rules

Rules live in `firestore.rules` and `storage.rules` at the project root
but aren't active until deployed:

```bash
npm install -g firebase-tools
firebase login
firebase init   # choose Firestore + Storage, point to the existing rules files, pick your project
firebase deploy --only firestore:rules,storage:rules
```

---

## 6. Project structure

```
src/
├── components/     shared UI pieces (StatCard, etc.)
├── pages/          route-level screens, grouped by admin/teacher/student
├── layouts/         sidebar + topbar shell
├── routes/          ProtectedRoute (role-based access guard)
├── context/         AuthContext (login state, current role)
├── firebase/        Firebase SDK initialization
├── types/           shared TypeScript types
├── services/        (empty — Firestore data-access functions go here next)
├── hooks/, utils/, validation/, charts/, assets/   (ready for later phases)
firestore.rules       server-side database access rules
storage.rules          server-side file storage access rules
scripts/seed.mjs       demo account/data creator
```

## 7. What happens next

Say what to build next and I'll add it into this same project, e.g.:

- "Build Phase 4 — Student Management" (add/edit/deactivate students)
- "Build the Attendance module"
- "Build the Marks module with grading"
- "Set up Docker deployment"
- "Generate the project report documentation"

Each phase plugs into the folder structure and security rules already
in place here.
