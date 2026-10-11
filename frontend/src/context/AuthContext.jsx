import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const storedToken = localStorage.getItem("freeio_token");
      const storedUser = localStorage.getItem("freeio_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to restore session from localStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      if (role && data.data?.role && data.data.role !== "admin" && data.data.role !== role) {
        throw new Error(`Role mismatch: This account is registered as a ${data.data.role}. A ${data.data.role} cannot join or log in as a ${role}.`);
      }

      setToken(data.token);
      setUser(data.data);
      localStorage.setItem("freeio_token", data.token);
      localStorage.setItem("freeio_user", JSON.stringify(data.data));

      return { success: true, user: data.data };
    } catch (err) {
      return { success: false, error: err.message || "Failed to connect to server" };
    }
  };

  const register = async ({ name, email, password, role, bio = "", location = "" }) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, bio, location }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      // Auto-login if registration succeeds
      const loginResult = await login(email, password);
      return { success: true, data: data.data, loginSuccess: loginResult.success };
    } catch (err) {
      return { success: false, error: err.message || "Failed to register" };
    }
  };

  const updateProfile = async (updates) => {
    try {
      let updatedUser = { ...user, ...updates };

      if (user?._id) {
        const usersApi = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/${user._id}`;
        const res = await fetch(usersApi, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (data.success && data.data) {
          updatedUser = data.data;
        }
      }

      setUser(updatedUser);
      localStorage.setItem("freeio_user", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      const fallbackUser = { ...user, ...updates };
      setUser(fallbackUser);
      localStorage.setItem("freeio_user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser, offline: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("freeio_token");
    localStorage.removeItem("freeio_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
