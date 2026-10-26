import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { StudentProfile } from '../types';

interface Props {
  initial?: StudentProfile | null;
  onClose: () => void;
  onSave: (data: Omit<StudentProfile, 'uid'>) => Promise<void>;
}

const emptyForm: Omit<StudentProfile, 'uid'> = {
  studentId: '',
  rollNumber: '',
  fullName: '',
  email: '',
  phone: '',
  department: '',
  course: '',
  division: '',
  semester: 1,
  academicYear: '',
  status: 'active',
};

export default function StudentFormModal({ initial, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<StudentProfile, 'uid'>>(emptyForm);
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

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.studentId.trim()) next.studentId = 'Student ID is required.';
    if (!form.rollNumber.trim()) next.rollNumber = 'Roll number is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.department.trim()) next.department = 'Department is required.';
    if (!form.course.trim()) next.course = 'Course is required.';
    if (!form.division.trim()) next.division = 'Division is required.';
    if (!form.semester || form.semester < 1 || form.semester > 8)
      next.semester = 'Semester must be between 1 and 8.';
    if (!form.academicYear.trim()) next.academicYear = 'Academic year is required.';
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
      setSaveError('Could not save this student. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
  const labelClass = 'block text-sm font-medium mb-1';
  const errorClass = 'text-xs text-red-600 mt-1';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold">{initial ? 'Edit Student' : 'Add Student'}</h2>
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

          <div>
            <label className={labelClass}>Full name</label>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
            />
            {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Student ID</label>
              <input
                className={inputClass}
                value={form.studentId}
                onChange={(e) => update('studentId', e.target.value)}
              />
              {errors.studentId && <p className={errorClass}>{errors.studentId}</p>}
            </div>
            <div>
              <label className={labelClass}>Roll number</label>
              <input
                className={inputClass}
                value={form.rollNumber}
                onChange={(e) => update('rollNumber', e.target.value)}
              />
              {errors.rollNumber && <p className={errorClass}>{errors.rollNumber}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Phone (optional)</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
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
              <label className={labelClass}>Course</label>
              <input
                className={inputClass}
                value={form.course}
                onChange={(e) => update('course', e.target.value)}
                placeholder="e.g. B.Tech"
              />
              {errors.course && <p className={errorClass}>{errors.course}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Division</label>
              <input
                className={inputClass}
                value={form.division}
                onChange={(e) => update('division', e.target.value)}
                placeholder="e.g. A"
              />
              {errors.division && <p className={errorClass}>{errors.division}</p>}
            </div>
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
              <label className={labelClass}>Academic year</label>
              <input
                className={inputClass}
                value={form.academicYear}
                onChange={(e) => update('academicYear', e.target.value)}
                placeholder="2025-26"
              />
              {errors.academicYear && <p className={errorClass}>{errors.academicYear}</p>}
            </div>
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