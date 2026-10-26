import { GraduationCap, Users, BookOpen, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../../components/StatCard';

// Placeholder data — Phase 4 (Student Management) will replace this
// with live counts pulled from Firestore.
const departmentData = [
  { dept: 'CSE', students: 240 },
  { dept: 'IT', students: 180 },
  { dept: 'ENTC', students: 150 },
  { dept: 'Mech', students: 120 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of the institution's academic data.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={690} icon={<GraduationCap size={20} />} />
        <StatCard label="Total Teachers" value={54} icon={<Users size={20} />} />
        <StatCard label="Subjects" value={112} icon={<BookOpen size={20} />} />
        <StatCard label="Departments" value={4} icon={<Building2 size={20} />} />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-sm font-medium mb-4">Students by Department</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="dept" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="students" fill="#3b6fed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-400">
        Data shown is placeholder demo data. It will connect to live Firestore
        counts once the Student/Teacher Management phase is built.
      </div>
    </div>
  );
}
