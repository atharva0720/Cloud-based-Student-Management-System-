import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Whenever Firebase's auth state changes, look up this user's role
    // in Firestore (the "users" collection). We never assume the role
    // from the client — Firestore Security Rules re-check it server-side
    // on every read/write anyway.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setAppUser(snap.data() as AppUser);
          } else {
            setAppUser(null);
            setError('No profile found for this account. Contact an administrator.');
          }
        } catch {
          setAppUser(null);
          setError('Could not load your account profile. Please try again.');
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password.');
      throw new Error('login-failed');
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      setError('Could not send reset email. Check the address and try again.');
      throw new Error('reset-failed');
    }
  }

  return (
    <AuthContext.Provider
      value={{ firebaseUser, appUser, loading, error, login, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
