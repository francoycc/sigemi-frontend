import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Creamos el contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Al cargar la app, verificamos si hay una sesión guardada
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Función global para Iniciar Sesión
    const login = (authData) => {
        // Separamos limpiamente el token de la entidad de usuario
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        setUser(authData.user);
        navigate('/dashboard');
    };

    // Función global para Cerrar Sesión
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    if (loading) return null; // Evita parpadeos mientras lee el localStorage

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar en cualquier pantalla
export const useAuth = () => useContext(AuthContext);