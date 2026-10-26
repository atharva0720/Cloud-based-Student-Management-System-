
import { BookOpen, Users, CalendarCheck, FileText } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500">Your assigned classes and subjects at a glance.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Assigned Subjects" value={3} icon={<BookOpen size={20} />} />
        <StatCard label="Students Taught" value={128} icon={<Users size={20} />} />
        <StatCard label="Today's Classes" value={4} icon={<CalendarCheck size={20} />} />
        <StatCard label="Pending Assignments" value={2} icon={<FileText size={20} />} />
      </div>
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-500">
        Attendance and Marks modules will appear here in the next phase.
      </div>
    </div>
  );
}
