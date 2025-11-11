import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

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
    } catch (e) {
      console.error("Token decode failed:", e);
      return null;
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const res = await loginUser(email, password);
      if (!res || res.statusCode !== 200) {
        toast.error(res?.message || "Invalid credentials");
        return { success: false };
      }
      const token = res.accessToken;
      if (!token) {
        toast.error("No token received from server");
        return { success: false };
      }
      const decoded = parseJwt(token);
      if (!decoded) {
        toast.error("Token parsing failed");
        return { success: false };
      }
      const userData = {
        id: decoded.nameid || decoded.NameIdentifier,
        email: decoded.email || decoded.Email,
        role: decoded.role || decoded.Role || "user",
        name: decoded.unique_name || decoded.name || decoded.Name || "",
      };
      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      return { success: true, role: userData.role };
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      const res = await registerUser(data);

      console.log("Register API response:", res); 

      if (res.statusCode !== 200) {
        toast.error(res.message || "Registration failed");
        return false;
      }

      const token = res.data || res.accessToken || res?.data?.accessToken;
      if (!token) {
        toast.error("No token received after registration");
        return false;
      }

      const decoded = parseJwt(token);
      if (!decoded) {
        toast.error("Token parsing failed");
        return false;
      }

      const userData = {
        id: decoded.nameid || decoded.NameIdentifier,
        email: decoded.email || decoded.Email,
        role: decoded.role || decoded.Role || "user",
        name: decoded.unique_name || decoded.name || decoded.Name || "",
      };

      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      
      return true;
    } catch (error) {
      toast.error("Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    sessionStorage.clear();
    
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      const isExpired = decoded?.exp * 1000 < Date.now();
      if (isExpired) logout();
      else setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
