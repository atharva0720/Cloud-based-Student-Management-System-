import { CalendarCheck, ClipboardList, FileText, Bell } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { appUser } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {appUser?.fullName?.split(' ')[0] ?? 'Student'}</h1>
        <p className="text-sm text-gray-500">Here's your academic snapshot.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Attendance" value="82%" icon={<CalendarCheck size={20} />} />
        <StatCard label="Average Marks" value="76%" icon={<ClipboardList size={20} />} />
        <StatCard label="Pending Assignments" value={1} icon={<FileText size={20} />} />
        <StatCard label="Unread Notices" value={3} icon={<Bell size={20} />} />
      </div>
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500">
        Subject-wise marks and attendance charts will appear here once the
        Attendance and Marks modules are built.
      </div>
    </div>
  );
}
