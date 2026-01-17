import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAdminLoggedIn') === 'true';
    });

    const login = (email, password) => {
        // Static credentials
        if (email === 'admin@masjid.com' && password === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('isAdminLoggedIn', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminLoggedIn');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
