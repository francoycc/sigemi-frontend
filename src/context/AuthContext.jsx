import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Bloque Try-Catch para "Self-Healing": Si algo falla al leer, limpiamos y reseteamos
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!storedToken || !storedUser) {
                throw new Error("Sesión incompleta detectada.");
            }

            const parsedUser = JSON.parse(storedUser);

            // Validación de Integridad: Detectamos si quedó pegada la estructura vieja
            // Si el objeto 'user' tiene un token anidado, o no tiene un rol válido, está corrupto.
            if (parsedUser.token !== undefined || !parsedUser.rol) {
                throw new Error("Estructura de sesión obsoleta o corrupta.");
            }

            setUser(parsedUser);
        } catch (error) {
            console.warn("⚠️ [Seguridad] Anomalía en la sesión. Purgando almacenamiento local...");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (authData) => {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        setUser(authData.user);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);