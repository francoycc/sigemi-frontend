import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import { NotificationsOutlined, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';
import { DRAWER_WIDTH } from '../config/constants';

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Estado para controlar el Sidebar en version celular
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
            case '/equipos': return 'Inventario de Equipos';
            case '/ordenes': return 'Gestión de Órdenes';
            default: return 'SIGEMI App';
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
            <CssBaseline />
            
            <AppBar 
                position="fixed" 
                elevation={0}
                sx={{ 
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E0E0E0',
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

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#1565C0' }}>
                        {getPageTitle(location.pathname)}
                    </Typography>
                    
                    <IconButton sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsOutlined />
                        </Badge>
                    </IconButton>
                    <IconButton onClick={handleLogout} color="default" title="Cerrar Sesión">
                        <LogoutIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar con lógica dual */}
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
                <Outlet />
            </Box>
        </Box>
    );
}