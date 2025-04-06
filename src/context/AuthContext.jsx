import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // בדיקה אם המשתמש מחובר בעת טעינת האפליקציה
    const checkUserLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        try {
          setCurrentUser(JSON.parse(storedUser));
          // אימות תוקף הטוקן מול השרת
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.data.data);
        } catch (err) {
          // במקרה של שגיאה - ניתוק המשתמש
          logout();
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // פונקציה להרשמת משתמש חדש
  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'אירעה שגיאה בהרשמה';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לכניסת משתמש
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'פרטי התחברות שגויים';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לניתוק משתמש
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error('שגיאה בניתוק:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  // פונקציה לעדכון פרטי המשתמש
  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};