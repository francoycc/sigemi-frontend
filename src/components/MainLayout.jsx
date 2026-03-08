import React, { useState } from 'react';
import { Box, Toolbar, IconButton, AppBar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 260;

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
            {/* AppBar visible solo en móviles para abrir el menú */}
            <AppBar 
                position="fixed" 
                sx={{ 
                    width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, 
                    ml: { lg: `${DRAWER_WIDTH}px` },
                    display: { lg: 'none' },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
                <Toolbar sx={{ display: { lg: 'none' } }} />
                {/* Outlet (Dashboard, Detalle, etc.) */}
                <Outlet /> 
            </Box>
        </Box>
    );
}