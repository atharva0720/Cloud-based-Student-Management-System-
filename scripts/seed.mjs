/**
 * Demo data seeder.
 *
 * This uses the Firebase ADMIN SDK, which must never run in the browser —
 * that's why it's a separate Node script, not part of the React app.
 *
 * SETUP:
 * 1. Firebase Console → Project Settings → Service Accounts →
 *    "Generate new private key". Save the JSON file as
 *    scripts/serviceAccountKey.json (already gitignored).
 * 2. From the project root: node scripts/seed.mjs
 *
 * This creates 3 demo Auth accounts + matching Firestore /users docs:
 *   admin@demo.com   / Demo@1234
 *   teacher@demo.com / Demo@1234
 *   student@demo.com / Demo@1234
 *
 * Change these passwords immediately in a real deployment.
 */
import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

const DEMO_PASSWORD = 'Demo@1234';

const demoUsers = [
  { email: 'admin@demo.com', role: 'admin', fullName: 'Admin User' },
  { email: 'teacher@demo.com', role: 'teacher', fullName: 'Teacher User' },
  { email: 'student@demo.com', role: 'student', fullName: 'Student User' },
];

async function seed() {
  for (const u of demoUsers) {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(u.email);
      console.log(`Auth user already exists: ${u.email}`);
    } catch {
      userRecord = await auth.createUser({
        email: u.email,
        password: DEMO_PASSWORD,
        displayName: u.fullName,
      });
      console.log(`Created auth user: ${u.email}`);
    }

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: u.email,
      role: u.role,
      fullName: u.fullName,
      status: 'active',
      createdAt: new Date(),
    });
    console.log(`Wrote /users/${userRecord.uid} with role=${u.role}`);
  }
  console.log('\nSeeding complete. Demo password for all accounts:', DEMO_PASSWORD);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
