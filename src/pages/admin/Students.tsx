import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Pencil, UserX, UserCheck } from 'lucide-react';
import type { StudentProfile } from '../../types';
import {
  subscribeToStudents,
  createStudent,
  updateStudent,
  deactivateStudent,
  reactivateStudent,
} from '../../services/students';
import StudentFormModal from '../../components/StudentFormModal';

export default function Students() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStudents(
      (data) => {
        setStudents(data);
        setLoading(false);
      },
      (message) => {
        setLoadError(message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [students, search]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(student: StudentProfile) {
    setEditing(student);
    setModalOpen(true);
  }

  async function handleSave(data: Omit<StudentProfile, 'uid'>) {
    if (editing?.uid) {
      await updateStudent(editing.uid, data);
    } else {
      await createStudent(data);
    }
  }

  async function toggleStatus(student: StudentProfile) {
    if (!student.uid) return;
    if (student.status === 'active') {
      await deactivateStudent(student.uid);
    } else {
      await reactivateStudent(student.uid);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Students</h1>
          <p className="text-sm text-gray-500">{students.length} total students</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2 text-sm font-medium self-start"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, roll no, ID, email, department…"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loadError && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">
          {loadError}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Roll No.</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Semester</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading students…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {students.length === 0
                    ? 'No students yet — click "Add Student" to create one.'
                    : 'No students match your search.'}
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.uid} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{s.fullName}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                </td>
                <td className="px-4 py-3">{s.rollNumber}</td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3">{s.semester}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === 'active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(s)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label={s.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      title={s.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    >
                      {s.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <StudentFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}