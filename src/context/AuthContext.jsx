import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ⭐ IMPORTANT: loading auth state
  const [authLoading, setAuthLoading] = useState(true);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  // ⭐ LOAD user + token on first render
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const decoded = parseJwt(savedToken);
      const expired = decoded?.exp * 1000 < Date.now();

      if (!expired) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        localStorage.clear();
      }
    }

    setAuthLoading(false); // 🔥 VERY IMPORTANT
  }, []);

  // --------------------------------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------------------------------
  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);

      if (!res || res.statusCode !== 200) return { success: false };

      const token = res.accessToken;
      const decoded = parseJwt(token);
      if (!decoded) return { success: false };

      const userData = {
        id: decoded.nameid,
        email: decoded.email,
        role: decoded.role,
        name: decoded.unique_name,
      };

      setUser(userData);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      return { success: true, role: userData.role };
    } catch {
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
