import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to /login if not authenticated
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

// Redirects if user doesn't have the required role
export const RoleRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/my-courses'} replace />;
    }
    return children;
};