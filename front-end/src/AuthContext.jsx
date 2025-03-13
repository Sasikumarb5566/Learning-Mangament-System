import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Load email from localStorage when the app starts
    const [email, setEmail] = useState(localStorage.getItem("email") || "");

    // Function to update email and store it in localStorage
    const login = (userEmail) => {
        setEmail(userEmail);
        localStorage.setItem("email", userEmail); // Store email in localStorage
    };

    // Function to clear email on logout
    const logout = () => {
        setEmail("");
        localStorage.removeItem("email"); // Remove email from localStorage
    };

    return (
        <AuthContext.Provider value={{ email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
