import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';

const DRAWER_WIDTH = 260;

export default function MainLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* --- TOPBAR (Estilo Flotante) --- */}
            <AppBar 
                position="fixed" 
                elevation={0} // Sin sombra dura, solo borde
                sx={{ 
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, // Ajuste con el ancho del sidebar
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    backgroundColor: '#ffffff', // Fondo blanco
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    color: 'text.primary'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Título de la Página Actual  */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#1565C0' }}>
                        Resumen de las Operaciones
                    </Typography>
                    
                    {/* Acciones */}
                    <IconButton color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    
                    <IconButton onClick={handleLogout} color="primary" title="Cerrar Sesión">
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* --- SIDEBAR --- */}
            <Sidebar />

            {/* --- CONTENIDO PRINCIPAL --- */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8, maxWidth: '100%' }}>
                {/* Aquí se renderizan las páginas hijas */}
                <Outlet />
            </Box>
        </Box>
    );
}