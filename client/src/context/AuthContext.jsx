import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.data.user);
            }
        } catch (err) {
            // Token refresh is handled by the api interceptor
            // If we still fail, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { token, refreshToken, user } = response.data.data;
                localStorage.setItem('token', token);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                setUser(user);
                return { success: true, user };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setError(null);
    }, []);

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
