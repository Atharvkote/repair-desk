import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { authService } from "@/services/auth.service";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const setToken = (token) => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/admin/me");
      setAdmin(res.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("isLoggedin :", isAuthenticated);
  }, []);

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await authService.login(phone, password);

      if (response.success) {
        const { data, token } = response;
        setToken(token);
        setAdmin(data);
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

