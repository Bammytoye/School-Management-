import { Route, Routes, Navigate } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Admin/Dashboard'
import Enrolment from './pages/Admin/Enrolment'
import Students from './pages/Admin/Students'
import Courses from './pages/Admin/Courses'
import MyCourses from './pages/Students/MyCourses'
import Attendance from './pages/Admin/Attendance';
import Grades from './pages/Admin/Grades';
import Profile from './pages/Admin/Profile';

function App() {

  return (
    <div className='mx-4'>
      <ToastContainer
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: '0.875rem', borderRadius: '10px', fontFamily: 'inherit' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<RoleRoute role="admin"><Dashboard /></RoleRoute>} />
        <Route path="/admin/students" element={<RoleRoute role="admin"><Students /></RoleRoute>} />
        <Route path="/admin/courses" element={<RoleRoute role="admin"><Courses /></RoleRoute>} />
        <Route path="/admin/enrolment" element={<RoleRoute role="admin"><Enrolment /></RoleRoute>} />
        <Route path="/admin/grades" element={<RoleRoute role="admin"><Grades /></RoleRoute>} />
        <Route path="/admin/attendance" element={<RoleRoute role="admin"><Attendance /></RoleRoute>} />

        {/* Student routes */}
        <Route path="/my-courses" element={<RoleRoute role="student"><MyCourses /></RoleRoute>} />

        {/* Shared routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App