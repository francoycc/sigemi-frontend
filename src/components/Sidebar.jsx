import React from 'react';
import { 
    Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Toolbar, Divider, Box, Typography, Avatar 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon,
    Inventory as EquipmentIcon, 
    Assignment as OrdersIcon,   
    Build as TaskIcon,          
    BarChart as ReportIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

const MENU_ITEMS = [
    { text: 'Panel de Control', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inventario de Equipos', icon: <EquipmentIcon />, path: '/equipos' },
    { text: 'Órdenes de Trabajo', icon: <OrdersIcon />, path: '/ordenes' },
    { text: 'Tareas Técnicas', icon: <TaskIcon />, path: '/tareas' },
    { text: 'Reportes y KPI', icon: <ReportIcon />, path: '/reportes' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Recuperamos el usuario (simulado)
    const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Operador', rol: 'Técnico' };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { 
                    width: DRAWER_WIDTH, 
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E0E0E0',
                },
            }}
        >
            {/* Header del Sidebar */}
            <Toolbar sx={{ px: 3 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    SIGEMI <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.7em', fontWeight: 400 }}>ENT</Box>
                </Typography>
            </Toolbar>
            <Divider />
            
            {/* Lista de Menú */}
            <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
                <List>
                    {MENU_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton 
                                    selected={active}
                                    onClick={() => navigate(item.path)}
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
                                    <ListItemIcon sx={{ 
                                        color: active ? 'primary.main' : 'text.secondary',
                                        minWidth: 40 
                                    }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        primaryTypographyProps={{ 
                                            fontSize: '0.9rem', 
                                            fontWeight: active ? 700 : 500 
                                        }} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Footer de Usuario */}
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
        </Drawer>
    );
}