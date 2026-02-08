import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../lib/api";
import { authService } from "@/services/auth.service";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState(null);

  // 🔐 prevents duplicate verification
  const hasVerifiedRef = useRef(false);

  const setTokens = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("adminToken", accessToken);
    } else {
      localStorage.removeItem("adminToken");
    }
    if (refreshToken) {
      localStorage.setItem("adminRefreshToken", refreshToken);
    } else {
      localStorage.removeItem("adminRefreshToken");
    }
  };

  const getTokens = () => {
    return {
      accessToken: localStorage.getItem("adminToken"),
      refreshToken: localStorage.getItem("adminRefreshToken"),
    };
  };

  const computePermissions = (userRole) => {
    const roleUpper = userRole?.toUpperCase();
    return {
      canDeleteServices: roleUpper === "SUPER_ADMIN",
      canDeleteParts: roleUpper === "SUPER_ADMIN",
      canEditServices: true, // Both ADMIN and SUPER_ADMIN can edit
      canEditParts: true,
      canCreateServices: true,
      canCreateParts: true,
      isSuperAdmin: roleUpper === "SUPER_ADMIN",
      isAdmin: roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN",
    };
  };

  const verifyToken = async () => {
    const { accessToken } = getTokens();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/admin/me");
      const userData = res.data.data;
      const userRole = res.data.role || userData?.role;
      
      setAdmin(userData);
      setRole(userRole);
      setPermissions(computePermissions(userRole));
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh token
        const { refreshToken } = getTokens();
        if (refreshToken) {
          try {
            const refreshRes = await authService.refreshToken(refreshToken);
            if (refreshRes.success) {
              setTokens(refreshRes.accessToken, refreshRes.refreshToken);
              // Retry the /me call
              const retryRes = await api.get("/admin/me");
              const userData = retryRes.data.data;
              const userRole = retryRes.data.role || userData?.role;
              setAdmin(userData);
              setRole(userRole);
              setPermissions(computePermissions(userRole));
              setIsAuthenticated(true);
              return;
            }
          } catch (refreshError) {
            // Refresh failed, clear everything
          }
        }
        // Clear tokens if refresh failed or no refresh token
        setTokens(null, null);
        setAdmin(null);
        setRole(null);
        setPermissions(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasVerifiedRef.current) return;

    hasVerifiedRef.current = true;
    verifyToken();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await authService.login(phone, password);

      if (response.success) {
        const { data, accessToken, refreshToken } = response;
        setTokens(accessToken, refreshToken);
        setAdmin(data);
        const userRole = data.role;
        setRole(userRole);
        setPermissions(computePermissions(userRole));
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
    setTokens(null, null);
    setAdmin(null);
    setRole(null);
    setPermissions(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        role,
        permissions,
        login,
        logout,
        refreshTokens: getTokens,
      }}
    >
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
