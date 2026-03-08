import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar, Breadcrumbs, Link
} from '@mui/material';
import { 
    Add, Edit, Delete, Visibility, Inventory, Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import equipoService from '../services/equipoService';

export default function Equipos() {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarEquipos = async () => {
        setLoading(true);
        try {
            console.log("Cargando inventario de equipos...");
            const data = await equipoService.getAll();
            setEquipos(data);
        } catch (error) {
            console.error("Error al cargar el inventario de equipos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEquipos();
    }, []);

    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro que deseas dar de baja el equipo: ${nombre}?`)) {
            try {
                console.log(`Intentando eliminar equipo ID ${id}...`);
                await equipoService.remove(id);
                cargarEquipos(); 
            } catch (error) {
                console.error("Error al eliminar equipo:", error);
                alert("Error al intentar eliminar. Es posible que tenga órdenes de trabajo asociadas.");
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1 }}>
            
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    Inventario de Equipos
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }} variant="rounded">
                        <Inventory fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800">Equipos de Planta</Typography>
                        <Typography variant="body1" color="text.secondary">Gestione el inventario y estado de la maquinaria.</Typography>
                    </Box>
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />} 
                    sx={{ px: 3, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                    onClick={() => navigate('/equipos/nuevo')}
                >
                    Registrar Equipo
                </Button>
            </Box>

            {/* Tabla de Datos */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>CÓDIGO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>NOMBRE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>N° SERIE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ESTADO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : equipos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay equipos registrados en el sistema.</TableCell>
                                </TableRow>
                            ) : equipos.map((eq) => (
                                <TableRow key={eq.idEquipo} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>
                                        {eq.codigoEquipo}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{eq.nombre}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{eq.numeroSerie}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={eq.estadoOperativo} 
                                            size="small" 
                                            color={eq.estadoOperativo === 'Operativo' ? 'success' : eq.estadoOperativo === 'EnReparacion' ? 'warning' : 'error'} 
                                            variant="outlined" 
                                            sx={{ fontWeight: 600 }} 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Ver Detalle">
                                            <IconButton size="small" color="info" onClick={() => navigate(`/equipos/${eq.idEquipo}`)}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="primary" onClick={() => navigate(`/equipos/editar/${eq.idEquipo}`)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Dar de Baja">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(eq.idEquipo, eq.nombre)}>
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