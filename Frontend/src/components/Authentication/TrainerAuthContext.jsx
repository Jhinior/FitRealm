import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [whoLogin, setWhoLogin] = useState('trainer-login');

    return (
        <AuthContext.Provider value={{ whoLogin, setWhoLogin }}>
            {children}
        </AuthContext.Provider>
    );
}