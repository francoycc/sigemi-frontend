import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ubicaciones from './pages/Ubicaciones';
import UbicacionDetalle from './pages/UbicacionDetalle';
import UbicacionFormPage from './pages/UbicacionFormPage';
import MainLayout from './components/MainLayout';
import Equipos from './pages/Equipos';
import EquipoFormPage from './pages/EquipoFormPage';
import EquipoDetalle from './pages/EquipoDetalle';

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
             
             {/* RUTAS UBICACIONES*/} 
             <Route path="/ubicaciones" element={<Ubicaciones />} />
             <Route path="/ubicaciones/nueva" element={<UbicacionFormPage />} />
             <Route path="/ubicaciones/:id" element={<UbicacionDetalle />} />  
             <Route path="/ubicaciones/editar/:id" element={<UbicacionFormPage />} />
             <Route path="/ubicaciones/:id/equipos" element={<Equipos />} />
             {/* RUTAS EQUIPOS */}
             <Route path="/equipos" element={<Equipos />} />
             <Route path="/equipos/nuevo" element={<EquipoFormPage />} />
             <Route path="equipos/:id" element={<EquipoDetalle />} />
             <Route path="/equipos/editar/:id" element={<EquipoFormPage />} />
             <Route path="/equipos/ubicacion/:idUbicacion" element={<Equipos />} />
             {/* Placeholders */}
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