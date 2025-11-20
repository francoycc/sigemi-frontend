import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Ruta del Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Aquí agregaremos más rutas después (ej. /dashboard) */}
      </Routes>
    </Router>
  );
}

export default App;