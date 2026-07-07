import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, List, ListItem, ListItemButton, his, ListItemText, 
    Divider, Typography, Avatar, ListItemIcon
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    LocationOn, 
    PrecisionManufacturing, 
    ConfirmationNumber, 
    Build, 
    Logout, 
    AccountCircle 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext'; 

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Extraemos datos normalizados de la sesión activa
    const { user, logout } = useAuth(); 
    const userRol = (user?.rol || user?.role || 'OPERARIO').toUpperCase(); 
    const username = user?.username || user?.nombre || 'Operario';

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isOptionActive = (path) => location.pathname.startsWith(path);

    const itemButtonStyle = (path) => ({
        borderRadius: 2,
        mb: 0.5,
        mx: 1,
        width: 'calc(100% - 16px)',
        backgroundColor: isOptionActive(path) ? 'primary.light' : 'transparent',
        color: isOptionActive(path) ? 'primary.main' : 'text.secondary',
        '&:hover': {
            backgroundColor: isOptionActive(path) ? 'primary.light' : 'grey.100',
            color: isOptionActive(path) ? 'primary.main' : 'text.primary',
        }
    });

    const itemIconStyle = (path) => ({
        color: isOptionActive(path) ? 'primary.main' : 'text.secondary',
        minWidth: 40
    });

    return (
        <Box sx={{ 
            width: 260, 
            height: '100vh', 
            bgcolor: '#FFFFFF', 
            borderRight: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column'
        }}>
            
            {/* Cabecera Sidebar */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 'bold' }}>
                    SG
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ lineHeight: 1.2 }}>
                        SIGEMI
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                        Mantenimiento Industrial
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Listado de Opciones del Menú */}
            <List sx={{ flexGrow: 1, px: 1 }}>
                
                {/* Opción Común */}
                <ListItem disablePadding>
                    <ListItemButton sx={itemButtonStyle('/dashboard')} onClick={() => navigate('/dashboard')}>
                        <ListItemIcon sx={itemIconStyle('/dashboard')}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                    </ListItemButton>
                </ListItem>

                {/* Bloque para SUPERVISOR y ADMINISTRADOR  */}
                {(userRol === 'SUPERVISOR' || userRol === 'ADMINISTRADOR') && (
                    <>
                        <Typography variant="overline" color="text.disabled" fontWeight="700" sx={{ px: 3, mt: 2, mb: 0.5, display: 'block' }}>
                            Planificación
                        </Typography>

                        <ListItem disablePadding>
                            <ListItemButton sx={itemButtonStyle('/ubicaciones')} onClick={() => navigate('/ubicaciones')}>
                                <ListItemIcon sx={itemIconStyle('/ubicaciones')}>
                                    <LocationOn />
                                </ListItemIcon>
                                <ListItemText primary="Ubicaciones Técnicas" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton sx={itemButtonStyle('/equipos')} onClick={() => navigate('/equipos')}>
                                <ListItemIcon sx={itemIconStyle('/equipos')}>
                                    <PrecisionManufacturing />
                                </ListItemIcon>
                                <ListItemText primary="Equipos" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton sx={itemButtonStyle('/ordenes')} onClick={() => navigate('/ordenes')}>
                                <ListItemIcon sx={itemIconStyle('/ordenes')}>
                                    <ConfirmationNumber />
                                </ListItemIcon>
                                <ListItemText primary="Órdenes de Trabajo" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton sx={itemButtonStyle('/tareas')} onClick={() => navigate('/tareas')}>
                                <ListItemIcon sx={itemIconStyle('/tareas')}>
                                    <Build />
                                </ListItemIcon>
                                <ListItemText primary="Monitoreo Tareas" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}

                {/* Bloque Operativo para OPERARIO y SUPERVISOR */}
                {(userRol === 'OPERARIO' || userRol === 'SUPERVISOR') && (
                    <>
                        <Typography variant="overline" color="text.disabled" fontWeight="700" sx={{ px: 3, mt: 2, mb: 0.5, display: 'block' }}>
                            Ejecución Técnica
                        </Typography>

                        <ListItem disablePadding>
                            <ListItemButton sx={itemButtonStyle('/tecnico/tareas')} onClick={() => navigate('/tecnico/tareas')}>
                                <ListItemIcon sx={itemIconStyle('/tecnico/tareas')}>
                                    <Build color="info" />
                                </ListItemIcon>
                                <ListItemText primary="Mi Cola de Trabajo" primaryTypographyProps={{ fontWeight: '600', variant: 'body2' }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>

            <Divider />

            {/* Panel de Perfil de Usuario Inferior */}
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, px: 1 }}>
                    <Avatar sx={{ bgcolor: userRol === 'OPERARIO' ? 'info.main' : 'primary.main', width: 36, height: 36 }}>
                        <AccountCircle />
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" fontWeight="700" color="text.primary" noWrap>
                            {username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ display: 'block' }}>
                            Rol: {userRol}
                        </Typography>
                    </Box>
                </Box>

                <ListItemButton onClick={logout} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Logout /></ListItemIcon>
                     <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
            </Box>

        </Box>
    );
}