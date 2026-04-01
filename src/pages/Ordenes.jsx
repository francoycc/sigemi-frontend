import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar, Breadcrumbs, Link, TextField, Grid, MenuItem, InputAdornment
} from '@mui/material';
import { 
    Add, Edit, Delete, Dashboard as DashboardIcon, 
    ConfirmationNumber, Build, CalendarMonth, QueryStats, Settings,
    PrecisionManufacturing, Person, Search, Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ordenService from '../services/ordenService';

export default function Ordenes() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [filteredOrdenes, setFilteredTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para los filtros 
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [prioridadFiltro, setPrioridadFiltro] = useState('');

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await ordenService.getAll();
            setOrdenes(data || []);
            setFilteredTareas(data || []);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
            setOrdenes([]);
            setFilteredTareas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // filtrado dinámico
    const aplicarFiltros = useCallback(() => {
        let temp = [...ordenes];

        // Búsqueda por texto (Código o Descripción)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            temp = temp.filter(o => 
                (o.codigoOrden && o.codigoOrden.toLowerCase().includes(lowerTerm)) ||
                (o.descripcion && o.descripcion.toLowerCase().includes(lowerTerm))
            );
        }
        if (tipoFiltro) {
            temp = temp.filter(o => o.tipo === tipoFiltro);
        }
        if (estadoFiltro) {
            temp = temp.filter(o => o.estado === estadoFiltro);
        }
        if (prioridadFiltro) {
            temp = temp.filter(o => o.prioridad === prioridadFiltro);
        }

        setFilteredTareas(temp);
    }, [ordenes, searchTerm, tipoFiltro, estadoFiltro, prioridadFiltro]);

    useEffect(() => {
        aplicarFiltros();
    }, [aplicarFiltros]);

    const handleDelete = async (id) => {
        if (!id) return;
        if (window.confirm('¿Eliminar definitivamente esta Orden de Mantenimiento y sus tareas asociadas?')) {
            try {
                await ordenService.remove(id);
                cargarDatos(); 
            } catch (error) {
                alert("Error al intentar eliminar la orden.");
            }
        }
    };

    // Helper seguro para IDs anidados o planos
    const getId = (obj, prefijo) => {
        if (!obj) return 'N/A';
        return obj[`id${prefijo}`] || obj.id || 'N/A';
    };

    // Helpers visuales
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
                <Typography color="text.primary" fontWeight="bold">Órdenes de Trabajo</Typography>
            </Breadcrumbs>

            {/* Cabecera Principal */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, boxShadow: 1 }} variant="rounded">
                        <ConfirmationNumber fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.02em' }}>
                            Órdenes de Mantenimiento
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Gestión centralizada de solicitudes e intervenciones a equipos.
                        </Typography>
                    </Box>
                </Box>
                <Button 
                    variant="contained" color="primary" startIcon={<Add />} 
                    sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                    onClick={() => navigate('/ordenes/nueva')}
                >
                    Nueva Orden
                </Button>
            </Box>

            {/* BARRA DE FILTROS */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3, bgcolor: '#FFFFFF' }}>
                <Grid container spacing={2}>
                    <Grid xs={12} sm={6} md={4}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Buscar</Typography>
                        <TextField
                            fullWidth placeholder="Código o descripción..." value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            }}
                        />
                    </Grid>
                    
                    <Grid xs={12} sm={6} md={2.6}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Tipo</Typography>
                        <TextField fullWidth select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="Preventivo">Preventivo</MenuItem>
                            <MenuItem value="Correctivo">Correctivo</MenuItem>
                            <MenuItem value="Predictivo">Predictivo</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid xs={12} sm={6} md={2.6}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Prioridad</Typography>
                        <TextField fullWidth select value={prioridadFiltro} onChange={(e) => setPrioridadFiltro(e.target.value)}>
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            <MenuItem value="Alta">Alta</MenuItem>
                            <MenuItem value="Media">Media</MenuItem>
                            <MenuItem value="Baja">Baja</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid xs={12} sm={6} md={2.8}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase' }}>Estado</Typography>
                        <TextField fullWidth select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                            <MenuItem value=""><em>Todos los estados</em></MenuItem>
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="EnProgreso">En Progreso</MenuItem>
                            <MenuItem value="Completada">Completada</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* TABLA PRINCIPAL */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', bgcolor: '#FFFFFF' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Código</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Detalle & Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Equipo Objetivo</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Supervisor</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Prioridad</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Fechas</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Estado</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredOrdenes.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 500 }}>No se encontraron órdenes de mantenimiento.</TableCell></TableRow>
                            ) : filteredOrdenes.map((orden, index) => {
                                const realId = getId(orden, 'Orden');
                                return (
                                <TableRow key={`orden-${realId || index}`} hover sx={{ '&:hover .acciones-container': { opacity: 1 } }}>
                                    
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="800" color="primary.main" sx={{ bgcolor: 'primary.50', display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1 }}>
                                            {orden.codigoOrden || `#${realId}`}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell sx={{ maxWidth: 250 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getTipoIcon(orden.tipo)}
                                                <Typography variant="body2" fontWeight="700" color="text.primary">{orden.tipo}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={orden.descripcion}>
                                                {orden.descripcion || 'Sin descripción'}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        {orden.equipo || orden.equipoNombre ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PrecisionManufacturing fontSize="small" sx={{ color: 'text.disabled' }} />
                                                <Typography variant="body2" fontWeight="600" color="text.primary">
                                                    {orden.equipoNombre || orden.equipo?.nombre || 'Equipo asignado'}
                                                </Typography>
                                            </Box>
                                        ) : <Typography variant="body2" color="text.disabled">Sin asignar</Typography>}
                                    </TableCell>

                                    <TableCell>
                                        {orden.supervisor || orden.supervisorNombre ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person fontSize="small" color="action" />
                                                <Typography variant="body2" fontWeight="500">
                                                    {orden.supervisorNombre || orden.supervisor?.username || 'Usuario'}
                                                </Typography>
                                            </Box>
                                        ) : <Typography variant="body2" color="text.disabled">No asignado</Typography>}
                                    </TableCell>

                                    <TableCell>
                                        <Chip label={orden.prioridad || 'Media'} size="small" color={getPrioridadColor(orden.prioridad)} variant="outlined" sx={{ fontWeight: 'bold' }} />
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Creada: {orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                            {orden.fechaInicio && (
                                                <Typography variant="caption" color="primary.main" fontWeight="600">
                                                    Inicio: {new Date(orden.fechaInicio).toLocaleDateString()}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Chip label={orden.estado} size="small" color={getEstadoColor(orden.estado)} sx={{ fontWeight: 'bold', borderRadius: 1.5 }} />
                                    </TableCell>
                                    
                                    <TableCell align="right">
                                        <Box className="acciones-container" sx={{ opacity: { xs: 1, lg: 0 }, transition: 'opacity 0.2s ease-in-out', display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <Tooltip title="Ver Panel de Orden (Tareas y Repuestos)">
                                                <IconButton size="small" color="default" onClick={() => realId !== 'N/A' && navigate(`/ordenes/${realId}`)}>
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar Orden">
                                                <IconButton size="small" color="primary" onClick={() => realId !== 'N/A' && navigate(`/ordenes/editar/${realId}`)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(realId)}>
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
                    <Typography variant="caption" fontWeight="600" color="text.secondary">
                        Mostrando {filteredOrdenes.length} órdenes
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}