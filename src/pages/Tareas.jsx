import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar, Breadcrumbs, Link
} from '@mui/material';
import { 
    Add, Edit, Delete, Assignment, Dashboard as DashboardIcon, Build
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tareaService from '../services/tareaService';

export default function Tareas() {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarTareas = async () => {
        console.log("Cargando tareas...");
        setLoading(true);
        try {
            const data = await tareaService.getAll();
            setTareas(data);
        } catch (error) {
            console.error("Error al cargar tareas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTareas();
    }, []);

    const handleDelete = async (id) => {
        console.log(`Intentando eliminar tarea ${id}...`);
        if (window.confirm('¿Eliminar definitivamente esta tarea?')) {
            try {
                await tareaService.remove(id);
                cargarTareas(); 
            } catch (error) {
                alert("Error al intentar eliminar la tarea.");
            }
        }
    };

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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }} variant="rounded">
                        <Assignment fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800">Tareas de Mantenimiento</Typography>
                        <Typography variant="body1" color="text.secondary">Gestión y seguimiento de trabajos técnicos.</Typography>
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

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>TÍTULO DE LA TAREA</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>TIPO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>EQUIPO ASOCIADO</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ESTADO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                            ) : tareas.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay tareas registradas.</TableCell></TableRow>
                            ) : tareas.map((t) => (
                                <TableRow key={t.idTarea} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{t.nombre}</TableCell>
                                    <TableCell>{t.tipoMantenimiento}</TableCell>
                                    <TableCell>
                                        {t.equipo ? (
                                            <Chip icon={<Build fontSize="small" />} label={t.equipo.codigoEquipo} size="small" variant="outlined" />
                                        ) : (
                                            <Typography variant="body2" color="text.disabled">Sin asignar</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={t.estadoTarea} size="small" color={getEstadoColor(t.estadoTarea)} sx={{ fontWeight: 'bold' }} />
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