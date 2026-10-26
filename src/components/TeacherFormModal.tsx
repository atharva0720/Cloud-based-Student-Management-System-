import { useState, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import type { TeacherProfile } from '../types';

interface Props {
  initial?: TeacherProfile | null;
  onClose: () => void;
  onSave: (data: Omit<TeacherProfile, 'uid'>) => Promise<void>;
}

const DESIGNATIONS = ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD'];

const emptyForm: Omit<TeacherProfile, 'uid'> = {
  teacherId: '',
  fullName: '',
  email: '',
  phone: '',
  department: '',
  designation: DESIGNATIONS[0],
  qualification: '',
  subjects: [],
  experienceYears: 0,
  joiningDate: '',
  status: 'active',
};

export default function TeacherFormModal({ initial, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<TeacherProfile, 'uid'>>(emptyForm);
  const [subjectDraft, setSubjectDraft] = useState('');
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

  function addSubject() {
    const value = subjectDraft.trim();
    if (value && !form.subjects.includes(value)) {
      update('subjects', [...form.subjects, value]);
    }
    setSubjectDraft('');
  }

  function handleSubjectKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSubject();
    }
  }

  function removeSubject(subject: string) {
    update(
      'subjects',
      form.subjects.filter((s) => s !== subject)
    );
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.teacherId.trim()) next.teacherId = 'Teacher ID is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.department.trim()) next.department = 'Department is required.';
    if (!form.qualification.trim()) next.qualification = 'Qualification is required.';
    if (form.experienceYears < 0) next.experienceYears = 'Must be 0 or more.';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required.';
    if (form.subjects.length === 0) next.subjects = 'Add at least one subject.';
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
      setSaveError('Could not save this teacher. Please try again.');
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
          <h2 className="font-semibold">{initial ? 'Edit Teacher' : 'Add Teacher'}</h2>
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
              <label className={labelClass}>Teacher ID</label>
              <input
                className={inputClass}
                value={form.teacherId}
                onChange={(e) => update('teacherId', e.target.value)}
              />
              {errors.teacherId && <p className={errorClass}>{errors.teacherId}</p>}
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
              <label className={labelClass}>Designation</label>
              <select
                className={inputClass}
                value={form.designation}
                onChange={(e) => update('designation', e.target.value)}
              >
                {DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Qualification</label>
              <input
                className={inputClass}
                value={form.qualification}
                onChange={(e) => update('qualification', e.target.value)}
                placeholder="e.g. Ph.D, M.Tech"
              />
              {errors.qualification && <p className={errorClass}>{errors.qualification}</p>}
            </div>
            <div>
              <label className={labelClass}>Experience (years)</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.experienceYears}
                onChange={(e) => update('experienceYears', Number(e.target.value))}
              />
              {errors.experienceYears && <p className={errorClass}>{errors.experienceYears}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Joining date</label>
            <input
              type="date"
              className={inputClass}
              value={form.joiningDate}
              onChange={(e) => update('joiningDate', e.target.value)}
            />
            {errors.joiningDate && <p className={errorClass}>{errors.joiningDate}</p>}
          </div>

          <div>
            <label className={labelClass}>Subjects taught</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.subjects.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSubject(s)}
                    aria-label={`Remove ${s}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              className={inputClass}
              value={subjectDraft}
              onChange={(e) => setSubjectDraft(e.target.value)}
              onKeyDown={handleSubjectKeyDown}
              onBlur={addSubject}
              placeholder="Type a subject and press Enter"
            />
            {errors.subjects && <p className={errorClass}>{errors.subjects}</p>}
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