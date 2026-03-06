import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on page refresh
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const saved = sessionStorage.getItem('user');
        if (token && saved) {
            setUser(JSON.parse(saved));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token, user } = res.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};