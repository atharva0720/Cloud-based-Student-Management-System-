import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { SubjectProfile, TeacherProfile } from '../types';

interface Props {
  initial?: SubjectProfile | null;
  teachers: TeacherProfile[];
  onClose: () => void;
  onSave: (data: Omit<SubjectProfile, 'uid'>) => Promise<void>;
}

const emptyForm: Omit<SubjectProfile, 'uid'> = {
  subjectCode: '',
  name: '',
  department: '',
  semester: 1,
  credits: 3,
  type: 'Theory',
  teacherId: '',
  teacherName: '',
  status: 'active',
};

export default function SubjectFormModal({ initial, teachers, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<SubjectProfile, 'uid'>>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      const { uid: _uid, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Picking a teacher stores both the id (for linking records later,
  // e.g. attendance) and the name (so the table can show it without
  // an extra lookup).
  function pickTeacher(id: string) {
    const teacher = teachers.find((t) => t.uid === id);
    setForm((f) => ({
      ...f,
      teacherId: id,
      teacherName: teacher ? teacher.fullName : '',
    }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.subjectCode.trim()) next.subjectCode = 'Subject code is required.';
    if (!form.name.trim()) next.name = 'Subject name is required.';
    if (!form.department.trim()) next.department = 'Department is required.';
    if (!form.semester || form.semester < 1 || form.semester > 8)
      next.semester = 'Semester must be between 1 and 8.';
    if (!form.credits || form.credits < 1 || form.credits > 10)
      next.credits = 'Credits must be between 1 and 10.';
    if (!form.teacherId) next.teacherId = 'Please assign a teacher.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setSaveError('Could not save this subject. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-sm font-medium mb-1';
  const errorClass = 'text-xs text-red-600 mt-1';
  const activeTeachers = teachers.filter((t) => t.status === 'active');

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold">{initial ? 'Edit Subject' : 'Add Subject'}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {saveError && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Subject code</label>
              <input
                className={inputClass}
                value={form.subjectCode}
                onChange={(e) => update('subjectCode', e.target.value)}
                placeholder="CS501"
              />
              {errors.subjectCode && <p className={errorClass}>{errors.subjectCode}</p>}
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Subject name</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Cloud Computing"
              />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Department</label>
              <input
                className={inputClass}
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                placeholder="e.g. CSE"
              />
              {errors.department && <p className={errorClass}>{errors.department}</p>}
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => update('type', e.target.value as 'Theory' | 'Practical')}
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Semester</label>
              <input
                type="number"
                min={1}
                max={8}
                className={inputClass}
                value={form.semester}
                onChange={(e) => update('semester', Number(e.target.value))}
              />
              {errors.semester && <p className={errorClass}>{errors.semester}</p>}
            </div>
            <div>
              <label className={labelClass}>Credits</label>
              <input
                type="number"
                min={1}
                max={10}
                className={inputClass}
                value={form.credits}
                onChange={(e) => update('credits', Number(e.target.value))}
              />
              {errors.credits && <p className={errorClass}>{errors.credits}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Assigned teacher</label>
            <select
              className={inputClass}
              value={form.teacherId}
              onChange={(e) => pickTeacher(e.target.value)}
            >
              <option value="">Select a teacher…</option>
              {activeTeachers.map((t) => (
                <option key={t.uid} value={t.uid}>
                  {t.fullName} ({t.department})
                </option>
              ))}
            </select>
            {activeTeachers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No active teachers yet — add one on the Teachers page first.
              </p>
            )}
            {errors.teacherId && <p className={errorClass}>{errors.teacherId}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}