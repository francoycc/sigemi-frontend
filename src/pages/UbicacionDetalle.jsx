import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, Button, Divider, CircularProgress, 
    Chip, Avatar, Breadcrumbs, Link, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Tooltip
} from '@mui/material';
import { 
    ArrowBack, Edit, Place, AccountTree, SettingsSuggest, Visibility
} from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';
import equipoService from '../services/equipoService';

export default function UbicacionDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [ubicacion, setUbicacion] = useState(null);
    const [equiposInstalados, setEquiposInstalados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalles = async () => {
            try {
                // Ejecutamos ambas peticiones en paralelo para mayor velocidad
                const [ubiData, equiposData] = await Promise.all([
                    ubicacionService.getById(id),
                    equipoService.getByUbicacion(id)
                ]);
                
                setUbicacion(ubiData);
                setEquiposInstalados(equiposData);
            } catch (error) {
                console.error("Error obteniendo detalles:", error);
                alert("No se pudo cargar la información requerida.");
                navigate('/ubicaciones');
            } finally {
                setLoading(false);
            }
        };
        fetchDetalles();
    }, [id, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!ubicacion) return null;

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: 1 }}>
            
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/ubicaciones')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <AccountTree sx={{ mr: 0.5 }} fontSize="inherit" /> Ubicaciones Técnicas
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    Detalle de Nodo
                </Typography>
            </Breadcrumbs>

            {/* Cabecera Principal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 64, height: 64 }} variant="rounded">
                        <Place fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="text.primary">
                            {ubicacion.nombre}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            CÓDIGO: <Chip label={ubicacion.codigo} size="small" variant="outlined" color="primary" />
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="outlined" color="inherit" startIcon={<ArrowBack />} 
                        onClick={() => navigate('/ubicaciones')} sx={{ borderColor: 'divider', borderRadius: 2 }}
                    >
                        Volver
                    </Button>
                    <Button 
                        variant="contained" color="primary" startIcon={<Edit />} 
                        onClick={() => navigate(`/ubicaciones/editar/${ubicacion.idUbicacion}`)} sx={{ borderRadius: 2 }}
                    >
                        Editar Ubicación
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                
                {/* Tarjeta de Información General */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountTree fontSize="small" /> DATOS DE LA UBICACIÓN
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Tipo</Typography>
                            <Typography variant="body1" fontWeight="500">{ubicacion.tipo || 'No especificado'}</Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Estado Operativo</Typography>
                            <Chip 
                                label={ubicacion.estado} 
                                color={ubicacion.estado === 'Operativo' ? 'success' : ubicacion.estado === 'EnReparacion' ? 'warning' : 'error'} 
                                size="small" sx={{ fontWeight: 'bold', mt: 0.5 }} 
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Dependencia (Nodo Padre)</Typography>
                            <Typography variant="body2" fontWeight="500" sx={{ mt: 0.5 }}>
                                {ubicacion.idPadre ? `ID Jerárquico: ${ubicacion.idPadre}` : 'Ninguna (Es un Nodo Raíz)'}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Tarjeta de Equipos Instalados */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SettingsSuggest fontSize="small" /> EQUIPOS INSTALADOS ({equiposInstalados.length})
                            </Typography>
                            {/* Botón rápido para registrar un equipo directamente aquí */}
                            <Button size="small" variant="text" onClick={() => navigate('/equipos/nuevo')}>
                                + Nuevo Equipo
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        {equiposInstalados.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#fafafa', borderRadius: 2, border: '1px dashed #ccc' }}>
                                <SettingsSuggest sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                <Typography variant="body1" color="text.secondary">
                                    No hay equipos registrados en esta ubicación.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>CÓDIGO</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>NOMBRE</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ESTADO</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>VER</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {equiposInstalados.map((eq) => (
                                            <TableRow key={eq.idEquipo} hover>
                                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>
                                                    {eq.codigoEquipo}
                                                </TableCell>
                                                <TableCell>{eq.nombre}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={eq.estadoOperativo} size="small" variant="outlined"
                                                        color={eq.estadoOperativo === 'Operativo' ? 'success' : eq.estadoOperativo === 'EnReparacion' ? 'warning' : 'error'} 
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Ver detalle del equipo">
                                                        <IconButton size="small" color="primary" onClick={() => navigate(`/equipos/${eq.idEquipo}`)}>
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
}