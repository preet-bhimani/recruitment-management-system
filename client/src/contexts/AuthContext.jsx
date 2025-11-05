import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Create Provider
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState("");

    // Load login state from localStorage on page refresh
    useEffect(() => {
        const storedtoken = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        const storedUserId = localStorage.getItem("userId");
        
        if (storedtoken) {
            setToken(storedtoken);
            setIsLoggedIn(true);
            setRole(userRole);
            setUserId(storedUserId);
        }
    }, []);

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
        <AuthContext.Provider value={{ token,isLoggedIn, role, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
