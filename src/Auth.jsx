import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const register = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };