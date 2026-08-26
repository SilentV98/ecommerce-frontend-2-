import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as utilLogin, registerUser as utilRegister, initAuth } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        initAuth();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email, password) => {
        const loggedInUser = utilLogin(email, password);
        setUser(loggedInUser);
        window.dispatchEvent(new Event('storage'));
        return loggedInUser;
    };

    const register = (name, email, password) => {
        const newUser = utilRegister(name, email, password);
        return newUser;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}