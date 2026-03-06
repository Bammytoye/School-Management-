import { Route, Routes, Navigate  } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Admin/Dashboard'
import Enrolment from './pages/Admin/Enrolment'
import Students from './pages/Admin/Students'
import Courses from './pages/Admin/Courses'
import MyCourses from './pages/Students/MyCourses'

function App() {

  return (
    <div className='mx-4'>
      <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard"  element={<RoleRoute role="admin"><Dashboard /></RoleRoute>} />
          <Route path="/admin/students"   element={<RoleRoute role="admin"><Students /></RoleRoute>} />
          <Route path="/admin/courses"    element={<RoleRoute role="admin"><Courses /></RoleRoute>} />
          <Route path="/admin/enrolments" element={<RoleRoute role="admin"><Enrolment /></RoleRoute>} />

          {/* Student routes */}
          <Route path="/my-courses" element={<RoleRoute role="student"><MyCourses /></RoleRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </div>
  )
}

export default App