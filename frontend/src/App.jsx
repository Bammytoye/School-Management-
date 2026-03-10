import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
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
import { AnimatePresence } from 'framer-motion';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
    const location = useLocation()
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
      <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin */}
                <Route path="/admin/dashboard"  element={<RoleRoute role="admin"><Dashboard /></RoleRoute>} />
                <Route path="/admin/students"   element={<RoleRoute role="admin"><Students /></RoleRoute>} />
                <Route path="/admin/courses"    element={<RoleRoute role="admin"><Courses /></RoleRoute>} />
                <Route path="/admin/enrolment" element={<RoleRoute role="admin"><Enrolment /></RoleRoute>} />
                <Route path="/admin/grades"     element={<RoleRoute role="admin"><Grades /></RoleRoute>} />
                <Route path="/admin/attendance" element={<RoleRoute role="admin"><Attendance /></RoleRoute>} />

                {/* Student */}
                <Route path="/my-courses" element={<RoleRoute role="student"><MyCourses /></RoleRoute>} />

                {/* Shared */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Default */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    </div>
  )
}

export default AnimatedRoutes