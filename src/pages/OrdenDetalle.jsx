import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Grid, Button, CircularProgress, 
    Chip, Divider, Breadcrumbs, Link, Avatar
} from '@mui/material';
import { 
    ArrowBack, Edit, Dashboard as DashboardIcon, ConfirmationNumber,
    EventNote, PrecisionManufacturing, Person, Assignment
} from '@mui/icons-material';
import ordenService from '../services/ordenService';

export default function OrdenDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrden = async () => {
            try {
                const data = await ordenService.getById(id);
                setOrden(data);
            } catch (error) {
                console.error("Error al cargar la orden:", error);
                alert("No se pudo cargar el detalle de la orden.");
                navigate('/ordenes');
            } finally {
                setLoading(false);
            }
        };
        fetchOrden();
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

    const getPrioridadColor = (prioridad) => {
        switch (prioridad) {
            case 'Alta': return 'error';
            case 'Media': return 'warning';
            case 'Baja': return 'success';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    if (!orden) return null;

    const ordenId = orden.idOrden || orden.id;
    const codigo = orden.codigoOrden || `#${ordenId}`;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
            
            {/* Navegación */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/ordenes')} sx={{ cursor: 'pointer' }}>
                    Órdenes
                </Link>
                <Typography color="text.primary" fontWeight="bold">Detalle {codigo}</Typography>
            </Breadcrumbs>

            {/* Cabecera */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 64, height: 64, boxShadow: 1 }} variant="rounded">
                        <ConfirmationNumber fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="text.primary">
                            Orden {codigo}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={orden.estado} color={getEstadoColor(orden.estado)} size="small" sx={{ fontWeight: 'bold' }} />
                            <Chip label={`Prioridad ${orden.prioridad}`} color={getPrioridadColor(orden.prioridad)} variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />
                            <Chip label={orden.tipo} size="small" sx={{ fontWeight: 'bold', bgcolor: 'grey.200' }} />
                        </Box>
                    </Box>
                </Box>
                <Button 
                    variant="contained" color="primary" startIcon={<Edit />}
                    onClick={() => navigate(`/ordenes/editar/${ordenId}`)}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                >
                    Editar Orden
                </Button>
            </Box>

            {/* Tarjetas de Información */}
            <Grid container spacing={3}>
                {/* Detalles Generales */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700">DESCRIPCIÓN DEL PROBLEMA</Typography>
                        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                            {orden.descripcion || 'No se proporcionó una descripción para esta orden.'}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Fechas */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%', bgcolor: 'grey.50' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventNote fontSize="small" /> CRONOGRAMA
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">Fecha Creación</Typography>
                            <Typography variant="body2" fontWeight="600">{orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleDateString() : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">Fecha Inicio</Typography>
                            <Typography variant="body2" fontWeight="600" color="primary.main">{orden.fechaInicio ? new Date(orden.fechaInicio).toLocaleDateString() : 'Pendiente'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Fecha Fin</Typography>
                            <Typography variant="body2" fontWeight="600">{orden.fechaFin ? new Date(orden.fechaFin).toLocaleDateString() : 'No finalizada'}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Asignaciones */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700">VINCULACIONES</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <PrecisionManufacturing color="action" fontSize="large" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Equipo Objetivo</Typography>
                                        <Typography variant="body1" fontWeight="600">{orden.equipoNombre || 'Equipo no especificado'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Person color="action" fontSize="large" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Supervisor a Cargo</Typography>
                                        <Typography variant="body1" fontWeight="600">{orden.supervisorNombre || 'Sin asignar'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tareas de la Orden */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700">TAREAS DE LA ORDEN</Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<Add />}
                            onClick={() => navigate(`/tareas/nueva?ordenId=${ordenId}`)}
                        >
                            Nueva Tarea
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {orden.tareas && orden.tareas.length > 0 ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Técnico</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orden.tareas.map((tarea) => (
                                        <TableRow key={tarea.idTarea}>
                                            <TableCell>{tarea.descripcion}</TableCell>
                                            <TableCell>{tarea.tecnicoNombre}</TableCell>
                                            <TableCell>
                                                <Chip label={tarea.estado} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => navigate(`/tareas/editar/${tarea.idTarea}`)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" color="text.secondary">No hay tareas registradas.</Typography>
                    )}
                </Paper>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/ordenes')} sx={{ borderRadius: 2 }}>
                    Volver al Listado
                </Button>
            </Box>
        </Box>
    );
}