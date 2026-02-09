import React, { createContext, useContext, useState } from 'react';
import { clearUserDataFromLocal, getUserDataFromLocal, setUserDataToLocal } from '../Utils/LocalStorageUtil';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUserDataFromLocal());

    const login = (userData) => {
        setUserDataToLocal(userData);
        setUser(userData);
    };

    const logout = () => {
        clearUserDataFromLocal();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);