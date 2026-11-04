import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("emolyrics_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn("Session check failed, clearing token:", err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem("emolyrics_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    localStorage.setItem("emolyrics_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("emolyrics_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
