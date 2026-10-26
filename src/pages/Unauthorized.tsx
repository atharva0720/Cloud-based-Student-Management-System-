import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
      <ShieldAlert size={40} className="text-red-500" />
      <h1 className="text-lg font-semibold">Access denied</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        You don't have permission to view this page, or your account isn't
        set up yet. Contact an administrator if you think this is a mistake.
      </p>
      <Link to="/login" className="text-brand-600 text-sm hover:underline">
        Back to login
      </Link>
    </div>
  );
}
