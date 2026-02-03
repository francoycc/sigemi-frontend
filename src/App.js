import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme/theme';  
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import MainLayout from './components/MainLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza estilos CSS */}
      <Router>
        <Routes>
          {/* Ruta por defecto redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />
          
          {/* Placeholder para el flujo alternativo */}
          <Route path="/recuperar-password" element={<h1>Pantalla de Recuperación (En construcción)</h1>} />
          
          {/* Rutas Privadas (Dentro del Layout) */}
          <Route element={<MainLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />
             
             {/* Rutas placeholder para evitar errores 404 si clickeas el menú */}
             <Route path="/equipos" element={<h2>Gestión de Activos</h2>} />
             <Route path="/ordenes" element={<h2>Órdenes de Trabajo</h2>} />
             <Route path="/tareas" element={<h2>Tareas</h2>} />
             <Route path="/reportes" element={<h2>Reportes</h2>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;