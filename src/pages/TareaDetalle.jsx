import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Grid, Button, CircularProgress, 
    Chip, Divider, Breadcrumbs, Link, Avatar
} from '@mui/material';
import { 
    ArrowBack, Edit, Dashboard as DashboardIcon, Assignment,
    ConfirmationNumber, Timer, Person, Build
} from '@mui/icons-material';
import tareaService from '../services/tareaService';

export default function TareaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tarea, setTarea] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTarea = async () => {
            try {
                const data = await tareaService.getById(id);
                setTarea(data);
            } catch (error) {
                console.error("Error al cargar la tarea:", error);
                alert("No se pudo cargar el detalle de la tarea.");
                navigate('/tareas');
            } finally {
                setLoading(false);
            }
        };
        fetchTarea();
    }, [id, navigate]);

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Pendiente': return 'warning';
            case 'EnProgreso': return 'info';
            case 'Completada': return 'success';
            case 'Cancelada': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    if (!tarea) return null;

    const tareaId = tarea.idTarea || tarea.id;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
            
            {/* Navegación */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/tareas')} sx={{ cursor: 'pointer' }}>
                    Tareas
                </Link>
                <Typography color="text.primary" fontWeight="bold">Detalle #{tareaId}</Typography>
            </Breadcrumbs>

            {/* Cabecera */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 64, height: 64, boxShadow: 1 }} variant="rounded">
                        <Assignment fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="text.primary">
                            Tarea Técnica #{tareaId}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={tarea.estado} color={getEstadoColor(tarea.estado)} size="small" sx={{ fontWeight: 'bold' }} />
                            <Chip label={tarea.tipo} size="small" sx={{ fontWeight: 'bold', bgcolor: 'grey.200' }} />
                        </Box>
                    </Box>
                </Box>
                <Button 
                    variant="contained" color="info" startIcon={<Edit />}
                    onClick={() => navigate(`/tareas/editar/${tareaId}`)}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                >
                    Editar Tarea
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Detalles y Tiempos */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700">TRABAJO A REALIZAR</Typography>
                        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap', mb: 3 }}>
                            {tarea.descripcion || 'Sin descripción detallada.'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Fecha de Ejecución</Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {tarea.fechaEjecucion ? new Date(tarea.fechaEjecucion).toLocaleDateString() : 'No programada'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Timer color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Tiempo Invertido</Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {tarea.tiempoInvertidoHoras ? `${tarea.tiempoInvertidoHoras} Horas` : '0 Horas'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Vinculaciones (Orden y Técnico) */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%', bgcolor: 'grey.50' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Build fontSize="small" /> ASIGNACIONES
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Orden Padre</Typography>
                            {tarea.ordenId ? (
                                <Chip 
                                    icon={<ConfirmationNumber fontSize="small" />} 
                                    label={`Orden #${tarea.ordenCodigo || tarea.ordenId}`} 
                                    color="primary" variant="outlined" 
                                    onClick={() => navigate(`/ordenes/${tarea.ordenId}`)}
                                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">Tarea independiente</Typography>
                            )}
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Técnico Ejecutor</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Person color="action" />
                                <Typography variant="body2" fontWeight="600">{tarea.tecnicoNombre || 'Sin asignar'}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/tareas')} sx={{ borderRadius: 2 }}>
                    Volver al Listado
                </Button>
            </Box>
        </Box>
    );
}