import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar, Breadcrumbs, Link, TextField, Autocomplete, Grid, MenuItem
} from '@mui/material';
import { 
    Add, Edit, Delete, Assignment, Dashboard as DashboardIcon, Person, ConfirmationNumber,
    CalendarMonth, Build, QueryStats, Settings, Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tareaService from '../services/tareaService';
import usuarioService from '../services/usuarioService';

export default function Tareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [tecnicosDisponible, setTecnicosDisponible] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [tecnicoFiltro, setTecnicoFiltro] = useState(null);
    const [filteredTareas, setFilteredTareas] = useState([]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [tareasData, tecnicosData] = await Promise.all([
                tareaService.getAll(),
                usuarioService.getAll()
            ]);
            setTareas(tareasData || []);
            setFilteredTareas(tareasData || []);
            setTecnicosDisponible(tecnicosData || []);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            setTareas([]);
            setFilteredTareas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const aplicarFiltros = useCallback(() => {
        let tempTareas = [...tareas];

        if (fechaDesde) {
            tempTareas = tempTareas.filter(t => t.fechaEjecucion && new Date(t.fechaEjecucion) >= new Date(fechaDesde));
        }
        if (fechaHasta) {
            tempTareas = tempTareas.filter(t => t.fechaEjecucion && new Date(t.fechaEjecucion) <= new Date(fechaHasta));
        }
        if (estadoFiltro) {
            tempTareas = tempTareas.filter(t => t.estado === estadoFiltro);
        }
        if (tecnicoFiltro) {
            tempTareas = tempTareas.filter(t => t.tecnicoId === tecnicoFiltro.idUsuario);
        }

        setFilteredTareas(tempTareas);
    }, [tareas, fechaDesde, fechaHasta, estadoFiltro, tecnicoFiltro]);

    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const handleDelete = async (id) => {
        if (!id) return;
        if (window.confirm('¿Eliminar definitivamente esta tarea?')) {
            try {
                await tareaService.remove(id);
                cargarDatos(); 
            } catch (error) {
                alert("Error al intentar eliminar la tarea.");
            }
        }
    };

    const pendingTasksCount = tareas.filter(t => t.estado === 'Pendiente').length;

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Pendiente': return 'warning';
            case 'EnProgreso': return 'info';
            case 'Completada': return 'success';
            case 'Cancelada': return 'error';
            default: return 'default';
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'Preventivo': return <CalendarMonth fontSize="small" color="info" />;
            case 'Correctivo': return <Build fontSize="small" color="error" />;
            case 'Predictivo': return <QueryStats fontSize="small" color="secondary" />;
            default: return <Settings fontSize="small" color="action" />;
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Typography color="text.primary" fontWeight="bold">Tareas Técnicas</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56, boxShadow: 1 }} variant="rounded">
                        <Assignment fontSize="large" />
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.02em' }}>Mantenimiento</Typography>
                            {pendingTasksCount > 0 && (
                                <Chip label={`${pendingTasksCount} Pendientes`} size="small" color="info" sx={{ fontWeight: 'bold', borderRadius: 1.5 }} />
                            )}
                        </Box>
                    </Box>
                </Box>
                <Button 
                    variant="contained" color="info" startIcon={<Add />} 
                    sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                    onClick={() => navigate('/tareas/nueva')}
                >
                    Nueva Tarea
                </Button>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Fecha Desde</Typography>
                        <TextField fullWidth type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'grey.50' } }} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Fecha Hasta</Typography>
                        <TextField fullWidth type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'grey.50' } }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Estado</Typography>
                        <TextField fullWidth select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'grey.50' } }}>
                            <MenuItem value=""><em>Todos los estados</em></MenuItem>
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="EnProgreso">En Progreso</MenuItem>
                            <MenuItem value="Completada">Completada</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Técnico Asignado</Typography>
                        <Autocomplete
                            id="tecnico-filtro" fullWidth options={tecnicosDisponible} 
                            getOptionLabel={(option) => option.username || ''}
                            isOptionEqualToValue={(option, value) => option.idUsuario === value.idUsuario}
                            value={tecnicoFiltro} onChange={(event, newValue) => setTecnicoFiltro(newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Todos los técnicos" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'grey.50' } }} />}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: '#FFFFFF' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Descripción</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Orden Asignada</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Técnico</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Fecha Ejec.</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Estado</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredTareas.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 500 }}>No se encontraron tareas.</TableCell></TableRow>
                            ) : filteredTareas.map((t) => {
                                // Extract the exact ID from the DTO
                                const tareaId = t.idTarea; 
                                
                                return (
                                <TableRow key={`tarea-${tareaId}`} hover sx={{ '&:hover .acciones-container': { opacity: 1 } }}>
                                    
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="700" sx={{ bgcolor: 'grey.100', display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, color: 'text.secondary' }}>
                                            #{tareaId}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getTipoIcon(t.tipo)}
                                            <Typography variant="body2" fontWeight="700" color="text.primary">{t.tipo}</Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <Typography variant="body2" color="text.secondary" title={t.descripcion}>{t.descripcion}</Typography>
                                    </TableCell>

                                    <TableCell>
                                        {t.ordenId ? (
                                            <Chip icon={<ConfirmationNumber fontSize="small" />} label={`#${t.ordenCodigo || t.ordenId}`} size="small" variant="outlined" color="primary" />
                                        ) : <Typography variant="body2" color="text.disabled">N/A</Typography>}
                                    </TableCell>

                                    <TableCell>
                                        {t.tecnicoNombre ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person fontSize="small" color="action" />
                                                <Typography variant="body2" fontWeight="500">{t.tecnicoNombre}</Typography>
                                            </Box>
                                        ) : <Typography variant="body2" color="text.disabled">Sin asignar</Typography>}
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {t.fechaEjecucion ? new Date(t.fechaEjecucion).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip label={t.estado} size="small" color={getEstadoColor(t.estado)} sx={{ fontWeight: 'bold', borderRadius: 1.5 }} />
                                    </TableCell>
                                    
                                    <TableCell align="right">
                                        <Box className="acciones-container" sx={{ opacity: { xs: 1, lg: 0 }, transition: 'opacity 0.2s ease-in-out', display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <Tooltip title="Ver Detalle">
                                                <IconButton size="small" color="default" onClick={() => navigate(`/tareas/${tareaId}`)}>
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar Tarea">
                                                <IconButton size="small" color="primary" onClick={() => navigate(`/tareas/editar/${tareaId}`)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(tareaId)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight="600" color="text.secondary">Mostrando {filteredTareas.length} tareas</Typography>
                </Box>
            </Paper>
        </Box>
    );
}