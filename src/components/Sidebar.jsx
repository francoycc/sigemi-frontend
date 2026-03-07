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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FAFBFD' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Typography variant="h5" fontWeight="900" color="primary">SIGEMI <Typography variant="caption" color="text.secondary">ENT</Typography></Typography>
            </Toolbar>
            
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="caption" fontWeight="700" textTransform="uppercase" color="text.secondary" display="block" sx={{ mb: 1, ml: 1.5 }}>
                    Menú Principal
                </Typography>
                <List sx={{ pt: 0 }}>
                    {MENU_ITEMS.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton 
                                onClick={() => handleNavigate(item.path)}
                                sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: isSelected(item.path) ? 'primary.main' : 'transparent',
                                    color: isSelected(item.path) ? 'white' : 'text.primary',
                                    '&:hover': { bgcolor: isSelected(item.path) ? 'primary.dark' : '#f0f0f0' }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isSelected(item.path) ? 600 : 400 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider />

            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>F</Avatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight="700">Franco CC</Typography>
                    <Typography variant="caption" color="text.secondary">Administrador</Typography>
                </Box>
                <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => navigate('/login')}>
                    <Settings fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' } }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                open
                sx={{ display: { xs: 'none', lg: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid', borderColor: 'divider' } }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}