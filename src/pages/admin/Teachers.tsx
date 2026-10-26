import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Pencil, UserX, UserCheck } from 'lucide-react';
import type { TeacherProfile } from '../../types';
import {
  subscribeToTeachers,
  createTeacher,
  updateTeacher,
  deactivateTeacher,
  reactivateTeacher,
} from '../../services/teachers';
import TeacherFormModal from '../../components/TeacherFormModal';

export default function Teachers() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTeachers(
      (data) => {
        setTeachers(data);
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
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q))
    );
  }, [teachers, search]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(teacher: TeacherProfile) {
    setEditing(teacher);
    setModalOpen(true);
  }

  async function handleSave(data: Omit<TeacherProfile, 'uid'>) {
    if (editing?.uid) {
      await updateTeacher(editing.uid, data);
    } else {
      await createTeacher(data);
    }
  }

  async function toggleStatus(teacher: TeacherProfile) {
    if (!teacher.uid) return;
    if (teacher.status === 'active') {
      await deactivateTeacher(teacher.uid);
    } else {
      await reactivateTeacher(teacher.uid);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Teachers</h1>
          <p className="text-sm text-gray-500">{teachers.length} total teachers</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2 text-sm font-medium self-start"
        >
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, ID, email, department, subject…"
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
              <th className="px-4 py-3 font-medium">Designation</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Subjects</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading teachers…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {teachers.length === 0
                    ? 'No teachers yet — click "Add Teacher" to create one.'
                    : 'No teachers match your search.'}
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.uid} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{t.fullName}</div>
                  <div className="text-xs text-gray-500">{t.email}</div>
                </td>
                <td className="px-4 py-3">{t.designation}</td>
                <td className="px-4 py-3">{t.department}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {t.subjects.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"
                      >
                        {s}
                      </span>
                    ))}
                    {t.subjects.length > 3 && (
                      <span className="text-xs text-gray-500">+{t.subjects.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === 'active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(t)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label={t.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      title={t.status === 'active' ? 'Deactivate' : 'Reactivate'}
                    >
                      {t.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <TeacherFormModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}