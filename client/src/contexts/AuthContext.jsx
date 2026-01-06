import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Create Provider
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [role, setRole] = useState(() => localStorage.getItem("role") || "");
    const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
    const [token, setToken] = useState(() => localStorage.getItem("token") || "")

    // Login function
    const login = (token, userRole, userId) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userId", userId);

        setToken(token);
        setIsLoggedIn(true);
        setRole(userRole);
        setUserId(userId);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        setToken("");
        setIsLoggedIn(false);
        setRole("");
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, role, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
