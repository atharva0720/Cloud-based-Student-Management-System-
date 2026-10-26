export type UserRole = 'admin' | 'teacher' | 'student';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  status: 'active' | 'inactive';
  createdAt?: unknown;
}

export interface StudentProfile {
  uid?: string;
  studentId: string;
  rollNumber: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  course: string;
  division: string;
  semester: number;
  academicYear: string;
  status: 'active' | 'inactive';
}

export interface TeacherProfile {
  uid?: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  qualification: string;
  subjects: string[];
  experienceYears: number;
  joiningDate: string;
  status: 'active' | 'inactive';
}

export interface SubjectProfile {
  uid?: string;
  subjectCode: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  type: 'Theory' | 'Practical';
  teacherId: string;
  teacherName: string;
  status: 'active' | 'inactive';
}