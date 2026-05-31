import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

export default function ProtectedRoute({ rolesPermitidos }) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Convertimos a mayúsculas para evitar problemas de casting con la BD
    const userRol = (user?.rol || user?.role || '').toUpperCase();

    if (rolesPermitidos && !rolesPermitidos.includes(userRol)) {
        // Si el rol no tiene permisos, se lo devuelve al Dashboard común de forma segura
        console.warn(`[SEGURIDAD] Intento de acceso no autorizado. Rol: ${userRol}. Requerido: ${rolesPermitidos}`);
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}