import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, saveToken, getToken, removeToken } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking existing session

  // On app load: try to restore session from saved token
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await authAPI.getMe();
          setUser(data.user);
        } catch {
          // Token expired or invalid — clear it
          removeToken();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Register
  const register = async (name, email, password, role) => {
    const data = await authAPI.register(name, email, password, role);
    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // Login
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // Logout
  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
