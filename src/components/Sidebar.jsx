import React from 'react';
import { 
    Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Toolbar, Typography, Divider, Box, Avatar,
    IconButton
} from '@mui/material';
import { 
    Dashboard, Inventory, Assignment, Build, BarChart, Settings, 
    Place 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260; 

// Colores corporativos
const SIDEBAR_BG = '#1976d2'; // Azul/Celeste corporativo primario (ajusta este hex si quieres un tono exacto)
const SIDEBAR_TEXT = '#ffffff'; // Texto blanco
const SIDEBAR_TEXT_MUTED = 'rgba(255, 255, 255, 0.7)'; // Texto secundario blanco translúcido
const SIDEBAR_HOVER = 'rgba(255, 255, 255, 0.1)'; // Hover sutil
const SIDEBAR_ACTIVE = 'rgba(255, 255, 255, 0.2)'; // Elemento seleccionado

const MENU_ITEMS = [
    { text: 'Panel de Control', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Ubicaciones Técnicas', icon: <Place />, path: '/ubicaciones' },
    { text: 'Inventario de Equipos', icon: <Inventory />, path: '/equipos' },
    { text: 'Órdenes de Trabajo', icon: <Assignment />, path: '/ordenes' },
    { text: 'Tareas Técnicas', icon: <Build />, path: '/tareas' },
    { text: 'Reportes y KPI', icon: <BarChart />, path: '/reportes' },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleNavigate = (path) => {
        navigate(path);
        if (mobileOpen && handleDrawerToggle) handleDrawerToggle();
    };

    const isSelected = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: SIDEBAR_BG, color: SIDEBAR_TEXT }}>
            
            {/* Logo y Cabecera */}
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 1 }}>
                    SIGEMI <Typography component="span" variant="caption" sx={{ color: SIDEBAR_TEXT_MUTED, ml: 0.5 }}>App</Typography>
                </Typography>
            </Toolbar>
            
            <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Menú de Navegación */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="caption" fontWeight="700" textTransform="uppercase" display="block" sx={{ mb: 1, ml: 1.5, color: SIDEBAR_TEXT_MUTED }}>
                    Menú Principal
                </Typography>
                
                <List sx={{ pt: 0 }}>
                    {MENU_ITEMS.map((item) => {
                        const active = isSelected(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
                                <ListItemButton 
                                    onClick={() => handleNavigate(item.path)}
                                    sx={{ 
                                        borderRadius: 2, 
                                        bgcolor: active ? SIDEBAR_ACTIVE : 'transparent',
                                        '&:hover': { bgcolor: active ? SIDEBAR_ACTIVE : SIDEBAR_HOVER },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    <ListItemIcon sx={{ 
                                        color: active ? SIDEBAR_TEXT : SIDEBAR_TEXT_MUTED, 
                                        minWidth: 40 
                                    }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        primaryTypographyProps={{ 
                                            fontSize: '0.9rem', 
                                            fontWeight: active ? 700 : 500,
                                            color: active ? SIDEBAR_TEXT : SIDEBAR_TEXT_MUTED 
                                        }} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {/* Perfil de Usuario Footer */}
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(0,0,0,0.1)' }}>
                <Avatar sx={{ bgcolor: '#ffffff', color: SIDEBAR_BG, fontWeight: 'bold' }}>F</Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight="700">Franco</Typography>
                    <Typography variant="caption" sx={{ color: SIDEBAR_TEXT_MUTED }}>Administrador</Typography>
                </Box>
                <IconButton 
                    size="small" 
                    sx={{ ml: 'auto', color: SIDEBAR_TEXT_MUTED, '&:hover': { color: SIDEBAR_TEXT } }} 
                    onClick={() => navigate('/login')}
                >
                    <Settings fontSize="small" />
                </IconButton>
            </Box>

        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
            {/* Drawer Móvil */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ 
                    display: { xs: 'block', lg: 'none' }, 
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' } 
                }}
            >
                {drawerContent}
            </Drawer>
            
            {/* Drawer Escritorio */}
            <Drawer
                variant="permanent"
                open
                sx={{ 
                    display: { xs: 'none', lg: 'block' }, 
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' } 
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}