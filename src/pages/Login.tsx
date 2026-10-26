import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      // Look up role to redirect to the right dashboard
      const uid = auth.currentUser?.uid;
      if (uid) {
        const snap = await getDoc(doc(db, 'users', uid));
        const role = snap.exists() ? snap.data().role : null;
        if (role === 'admin') navigate('/admin');
        else if (role === 'teacher') navigate('/teacher');
        else if (role === 'student') navigate('/student');
        else navigate('/unauthorized');
      }
    } catch {
      setFormError('Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setFormError('Enter your email above first, then click "Forgot password".');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setFormError('Could not send reset email.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-xl bg-brand-600 text-white mb-3">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-xl font-semibold">Cloud Student Management</h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4"
        >
          {formError && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}
          {resetSent && (
            <div className="text-sm text-green-700 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2">
              Password reset email sent.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Sign in
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-xs text-brand-600 hover:underline"
          >
            Forgot password?
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-400">
          Demo accounts: admin@demo.com / teacher@demo.com / student@demo.com
          <br />
          (create these in Firebase Console — see README)
        </p>
      </div>
    </div>
  );
}
