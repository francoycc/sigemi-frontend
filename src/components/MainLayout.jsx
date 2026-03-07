import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ubicaciones from './pages/Ubicaciones';
import UbicacionDetalle from './pages/UbicacionDetalle';
import UbicacionFormPage from './pages/UbicacionFormPage'; // <-- IMPORT NUEVO
import MainLayout from './components/MainLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<MainLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/ubicaciones" element={<Ubicaciones />} />
             
             {/* RUTAS ABM EN PÁGINA COMPLETA */}
             <Route path="/ubicaciones/crear" element={<UbicacionFormPage />} /> {/* Alta */}
             <Route path="/ubicaciones/:id" element={<UbicacionDetalle />} />  {/* Ver */}
             <Route path="/ubicaciones/:id/editar" element={<UbicacionFormPage />} /> {/* Modificación */}
             
             {/* Placeholders */}
             <Route path="/equipos" element={<h2>Gestión de Equipos</h2>} />
             <Route path="/ordenes" element={<h2>Listado de Órdenes</h2>} />
             <Route path="/tareas" element={<h2>Tareas</h2>} />
             <Route path="/reportes" element={<h2>Reportes</h2>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;