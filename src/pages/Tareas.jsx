import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar, Breadcrumbs, Link, TextField, Autocomplete, Grid
} from '@mui/material';
import { 
    Add, Edit, Delete, Assignment, Dashboard as DashboardIcon, Person, ConfirmationNumber
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tareaService from '../services/tareaService';
import usuarioService from '../services/usuarioService';

export default function Tareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [tecnicosDisponible, setTecnicosDisponible] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para los filtros
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
            setTareas(tareasData);
            setFilteredTareas(tareasData);
            setTecnicosDisponible(tecnicosData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Lógica de filtrado dinámico
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
            tempTareas = tempTareas.filter(t => t.tecnico?.idUsuario === tecnicoFiltro.idUsuario);
        }

        setFilteredTareas(tempTareas);
    }, [tareas, fechaDesde, fechaHasta, estadoFiltro, tecnicoFiltro]);

    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const handleDelete = async (id) => {
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

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1 }}>
            
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Typography color="text.primary" fontWeight="bold">Tareas Técnicas</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }} variant="rounded">
                        <Assignment fontSize="large" />
                    </Avatar>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h4" fontWeight="800">Mantenimiento</Typography>
                        {pendingTasksCount > 0 && (
                            <Chip label={`${pendingTasksCount} Pendientes`} size="small" color="info" sx={{ fontWeight: 'bold', borderRadius: 1.5 }} />
                        )}
                    </Box>
                </Box>
                <Button 
                    variant="contained" color="info" startIcon={<Add />} 
                    sx={{ px: 3, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                    onClick={() => navigate('/tareas/nueva')}
                >
                    Nueva Tarea
                </Button>
            </Box>

            {/* BARRA DE FILTROS */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            fullWidth type="date" label="Ejecución Desde" value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)} InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            fullWidth type="date" label="Ejecución Hasta" value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)} InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth select label="Estado" value={estadoFiltro} 
                            onChange={(e) => setEstadoFiltro(e.target.value)} 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value=""><em>-- Todos --</em></MenuItem>
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="EnProgreso">En Progreso</MenuItem>
                            <MenuItem value="Completada">Completada</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            id="tecnico-filtro" fullWidth options={tecnicosDisponible}
                            getOptionLabel={(option) => `${option.username} (${option.rol})`}
                            isOptionEqualToValue={(option, value) => option.idUsuario === value.idUsuario}
                            value={tecnicoFiltro} onChange={(event, newValue) => setTecnicoFiltro(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Filtrar por Técnico" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>TIPO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>DESCRIPCIÓN</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ORDEN</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>TÉCNICO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>FECHA EJEC.</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ESTADO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredTareas.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No se encontraron tareas.</TableCell></TableRow>
                            ) : filteredTareas.map((t) => (
                                <TableRow key={t.idTarea} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>#{t.idTarea}</TableCell>
                                    <TableCell>{t.tipo}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {t.descripcion}
                                    </TableCell>
                                    <TableCell>
                                        {t.orden ? (
                                            <Chip icon={<ConfirmationNumber fontSize="small" />} label={`#${t.orden.idOrden}`} size="small" variant="outlined" color="primary" />
                                        ) : <Typography variant="body2" color="text.disabled">N/A</Typography>}
                                    </TableCell>
                                    <TableCell>
                                        {t.tecnico ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person fontSize="small" color="action" />
                                                <Typography variant="body2" fontWeight="500">{t.tecnico.username}</Typography>
                                            </Box>
                                        ) : <Typography variant="body2" color="text.disabled">Sin asignar</Typography>}
                                    </TableCell>
                                    <TableCell>{t.fechaEjecucion ? new Date(t.fechaEjecucion).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip label={t.estado} size="small" color={getEstadoColor(t.estado)} sx={{ fontWeight: 'bold' }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar Tarea">
                                            <IconButton size="small" color="primary" onClick={() => navigate(`/tareas/editar/${t.idTarea}`)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(t.idTarea)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}