import React, { useMemo } from 'react';
import { 
    Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Toolbar, Divider, Box, Typography, Avatar 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon,
    PrecisionManufacturing as EquipmentIcon, 
    Assignment as OrdersIcon,   
    Build as TaskIcon,          
    BarChart as ReportIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Factory as PlaceIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from '../config/constants';

const MENU_ITEMS = [
    { text: 'Panel de Control', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ubicaciones Técnicas', icon: <PlaceIcon />, path: '/ubicaciones' },
    { text: 'Inventario de Activos', icon: <EquipmentIcon />, path: '/equipos' },
    { text: 'Órdenes de Trabajo', icon: <OrdersIcon />, path: '/ordenes' },
    { text: 'Tareas Técnicas', icon: <TaskIcon />, path: '/tareas' },
    { text: 'Reportes y KPI', icon: <ReportIcon />, path: '/reportes' },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle, window }) {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useMemo(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : { nombre: 'Invitado', rol: 'Sin Acceso' };
        } catch (e) {
            return { nombre: 'Error', rol: 'Limpiar Cache' };
        }
    }, []);

    const drawerContent = (
        <>
            <Toolbar sx={{ px: 3 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    SIGEMI <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.7em', fontWeight: 400 }}>App</Box>
                </Typography>
            </Toolbar>
            <Divider />
            
            <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
                <List>
                    {MENU_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton 
                                    selected={active}
                                    onClick={() => {
                                        navigate(item.path);
                                        if(mobileOpen && handleDrawerToggle) handleDrawerToggle(); 
                                    }}
                                    sx={{
                                        mx: 1.5,
                                        borderRadius: 1.5,
                                        borderLeft: active ? '4px solid #1565C0' : '4px solid transparent',
                                        backgroundColor: active ? 'primary.light' : 'transparent',
                                        color: active ? 'primary.dark' : 'text.secondary',
                                        '&:hover': {
                                            backgroundColor: active ? 'primary.light' : 'rgba(0,0,0,0.04)',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.light',
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 700 : 500 }} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#FAFAFA' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                    <PersonIcon />
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {user.nombre}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: 'text.secondary', display: 'block' }}>
                        {user.rol}
                    </Typography>
                </Box>
                <SettingsIcon fontSize="small" sx={{ color: 'text.disabled', ml: 'auto', cursor: 'pointer' }} />
            </Box>
        </>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
            {/* Drawer Celular */}
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Drawer PC */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: DRAWER_WIDTH,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}