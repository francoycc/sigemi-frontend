import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Grid, Card, CardContent, CardActions, 
    Button, Chip, CircularProgress, Avatar, Breadcrumbs, Link, TextField, MenuItem, Divider
} from '@mui/material';
import { 
    Build, Dashboard as DashboardIcon, PrecisionManufacturing, 
    LocationOn, PlayArrow, QueryBuilder, CheckCircle 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tareaService from '../services/tareaService';

export default function MisTareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Todos');

    // ID del usuario logueado 
    const userLogueado = JSON.parse(localStorage.getItem('user'));
    const tecnicoId = userLogueado?.idUsuario || userLogueado?.id || 1; 

    useEffect(() => {
        const cargarMisTareas = async () => {
            setLoading(true);
            try {
                const data = await tareaService.getAll();
                // Filtramos el técnico solo vea lo suyo
                const asignadas = (data || []).filter(t => t.tecnicoId === tecnicoId);
                setTareas(asignadas);
            } catch (error) {
                console.error("Error al cargar tareas operativas:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarMisTareas();
    }, [tecnicoId]);

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Pendiente': return 'warning';
            case 'EnProgreso': return 'info';
            case 'Completada': return 'success';
            case 'Cancelada': return 'error';
            default: return 'default';
        }
    };

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case 'Pendiente': return <QueryBuilder fontSize="small" />;
            case 'EnProgreso': return <PlayArrow fontSize="small" />;
            case 'Completada': return <CheckCircle fontSize="small" />;
            default: return null;
        }
    };

    const tareasFiltradas = filtroEstado === 'Todos' 
        ? tareas 
        : tareas.filter(t => t.estado === filtroEstado);    

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Typography color="text.primary" fontWeight="bold">Mi Cola de Trabajo</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }} variant="rounded">
                        <Build fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800">Tareas Asignadas</Typography>
                        <Typography variant="body2" color="text.secondary">Listado operativo de intervenciones técnicas en planta.</Typography>
                    </Box>
                </Box>

                {/* Filtro rápido por Estado */}
                <TextField
                    select size="small" value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    sx={{ minWidth: 180 }}
                    label="Filtrar Estado"
                >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Pendiente">Pendientes</MenuItem>
                    <MenuItem value="EnProgreso">En Progreso</MenuItem>
                    <MenuItem value="Completada">Completadas</MenuItem>
                </TextField>
            </Box>

            {tareasFiltradas.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography color="text.secondary" fontWeight="500">No tienes tareas pendientes de ejecución en este estado.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {tareasFiltradas.map((tarea) => (
                        <Grid item xs={12} sm={6} md={4} key={tarea.idTarea}>
                            <Card variant="outlined" sx={{ borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 1 } }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}>
                                            #T-{tarea.idTarea}
                                        </Typography>
                                        <Chip 
                                            icon={getEstadoIcon(tarea.estado)}
                                            label={tarea.estado} 
                                            size="small" 
                                            color={getEstadoColor(tarea.estado)} 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>

                                    <Typography variant="h6" fontWeight="700" gutterBottom sx={{ height: 56, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {tarea.descripcion}
                                    </Typography>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, color: 'text.secondary' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PrecisionManufacturing fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">Orden Vinculada: #{tarea.ordenCodigo || tarea.ordenId}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOn fontSize="small" />
                                            <Typography variant="body2">{tarea.tipo || 'Mantenimiento General'}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="contained" 
                                        color={tarea.estado === 'EnProgreso' ? 'success' : 'info'}
                                        fullWidth
                                        onClick={() => navigate(`/tecnico/tarea/${tarea.idTarea}`)}
                                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                    >
                                        {tarea.estado === 'EnProgreso' ? 'Continuar Ejecución' : 'Iniciar / Ver Detalle'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}