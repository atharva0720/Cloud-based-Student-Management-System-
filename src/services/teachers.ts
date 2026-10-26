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
import type { TeacherProfile } from '../types';

const teachersCol = collection(db, 'teachers');

export function subscribeToTeachers(
  onData: (teachers: TeacherProfile[]) => void,
  onError: (message: string) => void
) {
  const q = query(teachersCol, orderBy('fullName'));
  return onSnapshot(
    q,
    (snapshot) => {
      const teachers = snapshot.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as Omit<TeacherProfile, 'uid'>),
      }));
      onData(teachers);
    },
    () => {
      onError('Could not load teachers. Check your connection and try again.');
    }
  );
}

export async function createTeacher(data: Omit<TeacherProfile, 'uid'>) {
  await addDoc(teachersCol, data);
}

export async function updateTeacher(uid: string, data: Partial<TeacherProfile>) {
  await updateDoc(doc(db, 'teachers', uid), data);
}

export async function deactivateTeacher(uid: string) {
  await updateDoc(doc(db, 'teachers', uid), { status: 'inactive' });
}

export async function reactivateTeacher(uid: string) {
  await updateDoc(doc(db, 'teachers', uid), { status: 'active' });
}