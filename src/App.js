import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme/theme';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ubicaciones from './pages/Ubicaciones';
import UbicacionDetalle from './pages/UbicacionDetalle';
import UbicacionFormPage from './pages/UbicacionFormPage';
import Equipos from './pages/Equipos';
import EquipoFormPage from './pages/EquipoFormPage';
import EquipoDetalle from './pages/EquipoDetalle';
import Tareas from './pages/Tareas';
import TareaFormPage from './pages/TareaFormPage';
import TareaDetalle from './pages/TareaDetalle';
import Ordenes from './pages/Ordenes';
import OrdenFormPage from './pages/OrdenFormPage';
import OrdenDetalle from './pages/OrdenDetalle';
import MisTareas from './pages/MisTareas';
import PanelEjecucionTarea from './pages/PanelEjecucionTarea';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Rutas Comunes */}
            <Route element={<ProtectedRoute rolesPermitidos={['ADMINISTRADOR', 'SUPERVISOR', 'OPERARIO']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Rutas Planificación */}
            <Route element={<ProtectedRoute rolesPermitidos={['SUPERVISOR', 'ADMINISTRADOR']} />}>
                <Route path="/ubicaciones" element={<Ubicaciones />} />
                <Route path="/ubicaciones/nueva" element={<UbicacionFormPage />} />
                <Route path="/ubicaciones/editar/:id" element={<UbicacionFormPage />} />
                <Route path="/ubicaciones/:id" element={<UbicacionDetalle />} />

                <Route path="/equipos" element={<Equipos />} />
                <Route path="/equipos/nueva" element={<EquipoFormPage />} />
                <Route path="/equipos/editar/:id" element={<EquipoFormPage />} />
                <Route path="/equipos/:id" element={<EquipoDetalle />} />

                <Route path="/ordenes" element={<Ordenes />} />
                <Route path="/ordenes/nueva" element={<OrdenFormPage />} />
                <Route path="/ordenes/editar/:id" element={<OrdenFormPage />} />
                <Route path="/ordenes/:id" element={<OrdenDetalle />} />

                <Route path="/tareas" element={<Tareas />} />
                <Route path="/tareas/nueva" element={<TareaFormPage />} />
                <Route path="/tareas/editar/:id" element={<TareaFormPage />} />
                <Route path="/tareas/:id" element={<TareaDetalle />} />
            </Route>

            {/* Rutas Operativas */}
            <Route element={<ProtectedRoute rolesPermitidos={['OPERARIO', 'SUPERVISOR']} />}>
                <Route path="/tecnico/tareas" element={<MisTareas />} />
                <Route path="/tecnico/tarea/:id" element={<PanelEjecucionTarea />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;