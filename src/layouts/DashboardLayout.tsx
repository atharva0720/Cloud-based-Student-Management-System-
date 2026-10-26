import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  ClipboardList, FileText, Bell, ShieldCheck, LogOut, Menu, X, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Students', to: '/admin/students', icon: <GraduationCap size={18} /> },
    { label: 'Teachers', to: '/admin/teachers', icon: <Users size={18} /> },
    { label: 'Subjects', to: '/admin/subjects', icon: <BookOpen size={18} /> },
    { label: 'Notices', to: '/admin/notices', icon: <Bell size={18} /> },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: <ShieldCheck size={18} /> },
  ],
  teacher: [
    { label: 'Dashboard', to: '/teacher', icon: <LayoutDashboard size={18} /> },
    { label: 'Attendance', to: '/teacher/attendance', icon: <CalendarCheck size={18} /> },
    { label: 'Marks', to: '/teacher/marks', icon: <ClipboardList size={18} /> },
    { label: 'Assignments', to: '/teacher/assignments', icon: <FileText size={18} /> },
  ],
  student: [
    { label: 'Dashboard', to: '/student', icon: <LayoutDashboard size={18} /> },
    { label: 'Attendance', to: '/student/attendance', icon: <CalendarCheck size={18} /> },
    { label: 'Marks', to: '/student/marks', icon: <ClipboardList size={18} /> },
    { label: 'Assignments', to: '/student/assignments', icon: <FileText size={18} /> },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { appUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const items = appUser ? NAV_BY_ROLE[appUser.role] : [];

  function toggleDark() {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-64 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <span className="font-semibold text-brand-600">CSMS Cloud</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden md:block text-sm text-gray-500">
            Signed in as <span className="font-medium text-gray-800 dark:text-gray-200">{appUser?.fullName}</span>{' '}
            <span className="uppercase text-xs ml-1 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20">
              {appUser?.role}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
