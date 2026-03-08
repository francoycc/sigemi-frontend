import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, Button, Divider, CircularProgress, 
    Chip, Avatar, Breadcrumbs, Link
} from '@mui/material';
import { 
    ArrowBack, Edit, Inventory, SettingsSuggest, InfoOutlined, Place, Build
} from '@mui/icons-material';
import equipoService from '../services/equipoService';

export default function EquipoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const data = await equipoService.getById(id);
                setEquipo(data);
            } catch (error) {
                console.error("Error obteniendo detalle del equipo:", error);
                alert("No se pudo cargar la información del equipo.");
                navigate('/equipos');
            } finally {
                setLoading(false);
            }
        };
        fetchDetalle();
    }, [id, navigate]);

    // Helpers para estilos de Chips
    const getColorEstado = (estado) => {
        if (estado === 'Operativo') return 'success';
        if (estado === 'EnReparacion') return 'warning';
        return 'error';
    };

    const getColorCriticidad = (criticidad) => {
        if (criticidad === 'Alta') return 'error';
        if (criticidad === 'Media') return 'warning';
        return 'info';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!equipo) return null;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 1 }}>
            
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/equipos')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Inventory sx={{ mr: 0.5 }} fontSize="inherit" /> Equipos
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    Detalle Técnico
                </Typography>
            </Breadcrumbs>

            {/* Cabecera Principal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 64, height: 64 }} variant="rounded">
                        <SettingsSuggest fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="text.primary">
                            {equipo.nombre}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            CÓDIGO: <Chip label={equipo.codigoEquipo} size="small" variant="outlined" color="primary" />
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        variant="outlined" color="inherit" startIcon={<ArrowBack />} 
                        onClick={() => navigate('/equipos')} sx={{ borderColor: 'divider', borderRadius: 2 }}
                    >
                        Volver
                    </Button>
                    <Button 
                        variant="contained" color="primary" startIcon={<Edit />} 
                        onClick={() => navigate(`/equipos/editar/${equipo.idEquipo}`)} sx={{ borderRadius: 2 }}
                    >
                        Editar Equipo
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Columna Izquierda: Información Técnica */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoOutlined fontSize="small" /> ESPECIFICACIONES TÉCNICAS
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Tipo de Equipo</Typography>
                                <Typography variant="body1" fontWeight="500">{equipo.tipo || 'No especificado'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Marca</Typography>
                                <Typography variant="body1" fontWeight="500">{equipo.marca || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Modelo</Typography>
                                <Typography variant="body1" fontWeight="500">{equipo.modelo || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Número de Serie</Typography>
                                <Typography variant="body1" fontWeight="500" sx={{ fontFamily: 'monospace' }}>{equipo.numeroSerie || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Fecha Incorporación</Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {equipo.fechaIncorporacion ? new Date(equipo.fechaIncorporacion).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Frecuencia Mantenimiento (Días)</Typography>
                                <Typography variant="body1" fontWeight="500">{equipo.frecuencia ? `${equipo.frecuencia} días` : 'No asignada'}</Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Observaciones</Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px dashed #ccc' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {equipo.observaciones || 'No hay observaciones registradas para este equipo.'}
                                </Typography>
                            </Paper>
                        </Box>
                    </Paper>
                </Grid>

                {/* Columna Derecha: Estado y Ubicación */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        
                        {/* Tarjeta de Estado Operativo */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Build fontSize="small" /> DIAGNÓSTICO ACTUAL
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Estado Operativo</Typography>
                                    <Chip 
                                        label={equipo.estadoOperativo} 
                                        color={getColorEstado(equipo.estadoOperativo)} 
                                        sx={{ fontWeight: 'bold', px: 1, fontSize: '0.9rem' }} 
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Nivel de Criticidad</Typography>
                                    <Chip 
                                        label={`Criticidad ${equipo.criticidad}`} 
                                        color={getColorCriticidad(equipo.criticidad)} 
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', px: 1 }} 
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Tarjeta de Ubicación */}
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'primary.50' }}>
                                <Typography variant="overline" color="primary.main" fontWeight="700" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Place fontSize="small" /> UBICACIÓN ASIGNADA
                                </Typography>
                                <Divider sx={{ mb: 2, borderColor: 'primary.light' }} />
                                
                                {equipo.ubicacionTecnica ? (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="700" color="primary.dark">
                                            {equipo.ubicacionTecnica.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                                            {equipo.ubicacionTecnica.codigo}
                                        </Typography>
                                        <Button 
                                            variant="text" size="small" sx={{ mt: 1, px: 0 }}
                                            onClick={() => navigate(`/ubicaciones/${equipo.ubicacionTecnica.idUbicacion}`)}
                                        >
                                            Ver detalles de ubicación
                                        </Button>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                        Este equipo no se encuentra asignado a ninguna ubicación técnica.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}