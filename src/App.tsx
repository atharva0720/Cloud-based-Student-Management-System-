import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ComingSoon from './pages/ComingSoon';
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Subjects from './pages/admin/Subjects';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

function withLayout(children: ReactNode) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {withLayout(<AdminDashboard />)}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={<ProtectedRoute allowedRoles={['admin']}>{withLayout(<Students />)}</ProtectedRoute>}
          />
          <Route
            path="/admin/teachers"
            element={<ProtectedRoute allowedRoles={['admin']}>{withLayout(<Teachers />)}</ProtectedRoute>}
          />
          <Route
            path="/admin/subjects"
            element={<ProtectedRoute allowedRoles={['admin']}>{withLayout(<Subjects />)}</ProtectedRoute>}
          />
          <Route
            path="/admin/notices"
            element={<ProtectedRoute allowedRoles={['admin']}>{withLayout(<ComingSoon title="Notices" />)}</ProtectedRoute>}
          />
          <Route
            path="/admin/audit-logs"
            element={<ProtectedRoute allowedRoles={['admin']}>{withLayout(<ComingSoon title="Audit Logs" />)}</ProtectedRoute>}
          />

          {/* Teacher */}
          <Route
            path="/teacher"
            element={<ProtectedRoute allowedRoles={['teacher']}>{withLayout(<TeacherDashboard />)}</ProtectedRoute>}
          />
          <Route
            path="/teacher/attendance"
            element={<ProtectedRoute allowedRoles={['teacher']}>{withLayout(<ComingSoon title="Attendance" />)}</ProtectedRoute>}
          />
          <Route
            path="/teacher/marks"
            element={<ProtectedRoute allowedRoles={['teacher']}>{withLayout(<ComingSoon title="Marks" />)}</ProtectedRoute>}
          />
          <Route
            path="/teacher/assignments"
            element={<ProtectedRoute allowedRoles={['teacher']}>{withLayout(<ComingSoon title="Assignments" />)}</ProtectedRoute>}
          />

          {/* Student */}
          <Route
            path="/student"
            element={<ProtectedRoute allowedRoles={['student']}>{withLayout(<StudentDashboard />)}</ProtectedRoute>}
          />
          <Route
            path="/student/attendance"
            element={<ProtectedRoute allowedRoles={['student']}>{withLayout(<ComingSoon title="Attendance" />)}</ProtectedRoute>}
          />
          <Route
            path="/student/marks"
            element={<ProtectedRoute allowedRoles={['student']}>{withLayout(<ComingSoon title="Marks" />)}</ProtectedRoute>}
          />
          <Route
            path="/student/assignments"
            element={<ProtectedRoute allowedRoles={['student']}>{withLayout(<ComingSoon title="Assignments" />)}</ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}