import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ rolesPermitidos }) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Si no está logueado, al login
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
        // Si está logueado pero no tiene el rol requerido, redirige al Dashboard seguro
        return <Navigate to="/dashboard" replace />;
    }

    // Si cumple todo, renderiza el componente hijo
    return <Outlet/>;
}