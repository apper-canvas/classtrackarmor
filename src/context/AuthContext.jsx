import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "@/services/api/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app load
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const users = await userService.getAll();
      const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
      );
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, error: "Invalid credentials or role" };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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