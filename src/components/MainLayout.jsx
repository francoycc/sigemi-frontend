import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';

const DRAWER_WIDTH = 260;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estado para controlar el Sidebar en versión celular
    const [mobileOpen, setMobileOpen] = useState(false);
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const getPageTitle = (path) => {
        switch(path) {
            case '/dashboard': return 'Panel de Control';
            case '/equipos': return 'Administración y Control de Equipos';
            case '/ordenes': return 'Gestión de Órdenes';
            case '/tareas': return 'Gestión de Tareas';
            case '/reportes': return 'Bussiness Intelligence';
            default: return 'SIGEMI App';
        }
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
                    color: 'text.primary',
                    transition: 'width 0.3s'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Título de la Página Actual  */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#1565C0' }}>
                        {getPageTitle(location.pathname)}
                    </Typography>
                    
                    {/* Acciones */}
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={handleLogout} color="default" title="Salir">
                        <Logout sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* --- SIDEBAR --- */}
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            {/* --- CONTENIDO PRINCIPAL --- */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
                {/* Aquí se renderizan las páginas hijas */}
                <Outlet />
            </Box>
        </Box>
    );
}