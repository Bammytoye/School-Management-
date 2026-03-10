import { createContext, useContext, useState } from 'react';
import { authAPI } from '../API/authAPI';

const AuthContext = createContext(null);

const getStoredUser = () => {
    try {
        const token = localStorage.getItem('token');
        const saved = localStorage.getItem('user');
        if (token && saved) return JSON.parse(saved);
    } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);
    const [loading] = useState(false);

    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Merge updated fields to keep old data intact
    const updateUser = (updatedFields) => {
        setUser(prev => {
            const merged = { ...prev, ...updatedFields };
            localStorage.setItem('user', JSON.stringify(merged));
            return merged;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};