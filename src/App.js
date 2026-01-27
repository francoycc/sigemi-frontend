import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import Login from './pages/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Azul
    },
    secondary: {
      main: '#ED6C02', // Naranja
    },
  },
});

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
          
          {/* Placeholder para el dashboard */}
          <Route path="/dashboard" element={<h1>Bienvenido a SIGEMI (Dashboard)</h1>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;