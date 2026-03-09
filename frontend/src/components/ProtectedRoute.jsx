import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Redirects to /login if not authenticated
export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" replace />
}

// Redirects if user doesn't have the required role
export const RoleRoute = ({ children, role }) => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />

    if (user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-courses'} replace />
    }

    return children
}