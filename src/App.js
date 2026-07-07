import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';

import theme from './theme/theme';
//import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ubicaciones from './pages/Ubicaciones';
import UbicacionDetalle from './pages/UbicacionDetalle';
import UbicacionFormPage from './pages/UbicacionFormPage';
import MainLayout from './components/MainLayout';
import Equipos from './pages/Equipos';
import EquipoFormPage from './pages/EquipoFormPage';
import EquipoDetalle from './pages/EquipoDetalle';
import Tareas from './pages/Tareas';
import TareaFormPage from './pages/TareaFormPage';
import TareaDetalle from './pages/TareaDetalle';
import Ordenes from './pages/Ordenes';
import OrdenFormPage from './pages/OrdenFormPage';
import OrdenDetalle from './pages/OrdenDetalle';
// Nuevas páginas para el técnico
import MisTareas from './pages/MisTareas';
import PanelEstadoTareas from './pages/PanelEstadoTareas';

function UserProfileFallback() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div style={{ padding: '24px' }}>
            <h2>Perfil del Usuario</h2>
            <p><strong>Usuario:</strong> {user?.username}</p>
            <p><strong>Rol Asignado:</strong> {user?.rol}</p>
        </div>
    );
}


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
            <Routes>
                    {/* Ruta Pública de Autenticación */}
                    <Route path="/login" element={<Login />} />

                    {/* =======================================================
                        RUTAS COMUNES PROTEGIDAS (Cualquier rol autenticado)
                       ======================================================= */}
                    <Route element={<ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO']} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {
                        /*<Route path="/profile" element={<UserProfileFallback />} />
                          */}
                          
                    </Route>

                    {/* =======================================================
                        RUTAS EXCLUSIVAS DE GESTIÓN (Supervisor y Admin)
                       ======================================================= */}
                    <Route element={<ProtectedRoute rolesPermitidos={['SUPERVISOR', 'ADMINISTRADOR']} />}>
                        {/* Control de Ubicaciones Técnicas */}
                        <Route path="/ubicaciones" element={<Ubicaciones />} />
                        <Route path="/ubicaciones/nueva" element={<UbicacionFormPage />} />
                        <Route path="/ubicaciones/editar/:id" element={<UbicacionFormPage />} />
                        <Route path="/ubicaciones/:id" element={<UbicacionDetalle />} />

                        {/* Control de Equipos Industriales */}
                        <Route path="/equipos" element={<Equipos />} />
                        <Route path="/equipos/nueva" element={<EquipoFormPage />} />
                        <Route path="/equipos/editar/:id" element={<EquipoFormPage />} />
                        <Route path="/equipos/:id" element={<EquipoDetalle />} />

                        {/* Planificación de Órdenes de Mantenimiento */}
                        <Route path="/ordenes" element={<Ordenes />} />
                        <Route path="/ordenes/nueva" element={<OrdenFormPage />} />
                        <Route path="/ordenes/editar/:id" element={<OrdenFormPage />} />
                        <Route path="/ordenes/:id" element={<OrdenDetalle />} />

                        {/* Monitoreo General de Tareas */}
                        <Route path="/tareas" element={<Tareas />} />
                        <Route path="/tareas/nueva" element={<TareaFormPage />} />
                        <Route path="/tareas/editar/:id" element={<TareaFormPage />} />
                        <Route path="/tareas/:id" element={<TareaDetalle />} />
                    </Route>

                    {/* =======================================================
                        RUTAS EXCLUSIVAS OPERATIVAS (Técnico / Operario)
                       ======================================================= */}
                    <Route element={<ProtectedRoute rolesPermitidos={['OPERARIO', 'SUPERVISOR']} />}>
                        {/* Cola de trabajo y Panel de ejecución del Técnico */}
                        <Route path="/tecnico/tareas" element={<MisTareas />} />
                        <Route path="/tecnico/tarea/:id" element={<PanelEstadoTareas />} />
                    </Route>

                    {/* Redirección por defecto ante cualquier ruta inválida o inexistente */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;