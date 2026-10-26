import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Pencil, Ban, CircleCheck } from 'lucide-react';
import type { SubjectProfile, TeacherProfile } from '../../types';
import {
  subscribeToSubjects,
  createSubject,
  updateSubject,
  deactivateSubject,
  reactivateSubject,
} from '../../services/subjects';
import { subscribeToTeachers } from '../../services/teachers';
import SubjectFormModal from '../../components/SubjectFormModal';

export default function Subjects() {
  const [subjects, setSubjects] = useState<SubjectProfile[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectProfile | null>(null);

  useEffect(() => {
    const unsubSubjects = subscribeToSubjects(
      (data) => {
        setSubjects(data);
        setLoading(false);
      },
      (message) => {
        setLoadError(message);
        setLoading(false);
      }
    );
    // Teachers are loaded too, to fill the "assigned teacher" dropdown.
    const unsubTeachers = subscribeToTeachers(setTeachers, () => {});
    return () => {
      unsubSubjects();
      unsubTeachers();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subjects.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q);
      const matchesSemester = semesterFilter === 'all' || String(s.semester) === semesterFilter;
      return matchesSearch && matchesSemester;
    });
  }, [subjects, search, semesterFilter]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(subject: SubjectProfile) {
    setEditing(subject);
    setModalOpen(true);
  }

  async function handleSave(data: Omit<SubjectProfile, 'uid'>) {
    if (editing?.uid) {
      await updateSubject(editing.uid, data);
    } else {
      await createSubject(data);
    }
  }

  async function toggleStatus(subject: SubjectProfile) {
    if (!subject.uid) return;
    if (subject.status === 'active') {
      await deactivateSubject(subject.uid);
    } else {
      await reactivateSubject(subject.uid);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Subjects</h1>
          <p className="text-sm text-gray-500">{subjects.length} total subjects</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2 text-sm font-medium self-start"
        >
          <Plus size={16} /> Add Subject
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, code, department, teacher…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={String(n)}>
              Semester {n}
            </option>
          ))}
        </select>
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
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Dept / Sem</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Credits</th>
              <th className="px-4 py-3 font-medium">Teacher</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading subjects…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {subjects.length === 0
                    ? 'No subjects yet — click "Add Subject" to create one.'
                    : 'No subjects match your filters.'}
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.uid} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.subjectCode}</div>
                </td>
                <td className="px-4 py-3">
                  {s.department} · Sem {s.semester}
                </td>
                <td className="px-4 py-3">{s.type}</td>
                <td className="px-4 py-3">{s.credits}</td>
                <td className="px-4 py-3">{s.teacherName || '—'}</td>
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
                      {s.status === 'active' ? <Ban size={16} /> : <CircleCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <SubjectFormModal
          initial={editing}
          teachers={teachers}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}