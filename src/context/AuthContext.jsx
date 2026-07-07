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
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/dashboard'); // Redirige al entrar
    };

    // Función global para Cerrar Sesión
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login'); // Lo manda afuera
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