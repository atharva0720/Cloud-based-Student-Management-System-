import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { SubjectProfile } from '../types';

const subjectsCol = collection(db, 'subjects');

export function subscribeToSubjects(
  onData: (subjects: SubjectProfile[]) => void,
  onError: (message: string) => void
) {
  const q = query(subjectsCol, orderBy('name'));
  return onSnapshot(
    q,
    (snapshot) => {
      const subjects = snapshot.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as Omit<SubjectProfile, 'uid'>),
      }));
      onData(subjects);
    },
    () => {
      onError('Could not load subjects. Check your connection and try again.');
    }
  );
}

export async function createSubject(data: Omit<SubjectProfile, 'uid'>) {
  await addDoc(subjectsCol, data);
}

export async function updateSubject(uid: string, data: Partial<SubjectProfile>) {
  await updateDoc(doc(db, 'subjects', uid), data);
}

export async function deactivateSubject(uid: string) {
  await updateDoc(doc(db, 'subjects', uid), { status: 'inactive' });
}

export async function reactivateSubject(uid: string) {
  await updateDoc(doc(db, 'subjects', uid), { status: 'active' });
}