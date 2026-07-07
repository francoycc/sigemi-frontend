import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import { useAuth } from '../context/AuthContext'; // <-- NUEVO

export default function ProtectedRoute({ rolesPermitidos }) {
    const { user } = useAuth(); // Leemos del contexto global

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRol = (user?.rol || user?.role || '').toUpperCase();

    if (rolesPermitidos && !rolesPermitidos.includes(userRol)) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}