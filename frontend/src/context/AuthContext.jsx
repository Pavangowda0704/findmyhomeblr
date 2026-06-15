import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fmhblr_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fmhblr_token');
    if (token) {
      authService.getMe()
        .then(res => { setUser(res.data.user); })
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { token, user } = res.data;
    localStorage.setItem('fmhblr_token', token);
    localStorage.setItem('fmhblr_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const { token, user } = res.data;
    localStorage.setItem('fmhblr_token', token);
    localStorage.setItem('fmhblr_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('fmhblr_token');
    localStorage.removeItem('fmhblr_user');
    setUser(null);
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fmhblr_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
