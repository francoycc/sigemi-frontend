import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import { 
    Add, Edit, FolderOpen, AccountTree, Delete, Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ubicacionService from '../services/ubicacionService';
import UbicacionBreadcrumbs from '../components/UbicacionBreadcrumbs';

export default function Ubicaciones() {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState(null);
    const [children, setChildren] = useState([]);
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadView = useCallback(async (id) => {
        setLoading(true);
        try {
            const data = await ubicacionService.getByParentId(id);
            setChildren(data);
            if (id === null) {
                setPath([]);
            } else {
                const currentNode = await ubicacionService.getById(id);
                setPath(prev => {
                    const existingIndex = prev.findIndex(p => p.idUbicacion === id);
                    if (existingIndex === -1) {
                        return [...prev, currentNode];
                    } else {
                        return prev.slice(0, existingIndex + 1);
                    }
                });
            }
        } catch (error) {
            console.error("Error cargando jerarquía", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadView(currentId);
    }, [currentId, loadView]);

    const handleNavigate = (id) => setCurrentId(id);

    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro que deseas dar de baja: ${nombre}?`)) {
            try {
                await ubicacionService.remove(id);
                loadView(currentId); 
            } catch (error) {
                console.error("Error al eliminar ubicación:", error);
                alert("Error al intentar eliminar.");
            }
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }} variant="rounded">
                        <AccountTree />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">Estructura de Activos</Typography>
                        <Typography variant="body2" color="text.secondary">Navegue por la jerarquía de plantas y sectores.</Typography>
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ px: 3, borderRadius: 2 }}
                    onClick={() => navigate('/ubicaciones/nueva')}
                >
                    Nuevo Nodo
                </Button>
            </Box>
            
            <UbicacionBreadcrumbs path={path} onNavigate={handleNavigate} />

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>CÓDIGO</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>NOMBRE</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ESTADO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
                            ) : children.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay elementos hijos.</TableCell></TableRow>
                            ) : children.map((row) => (
                                <TableRow key={row.idUbicacion} hover>
                                    <TableCell 
                                        sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
                                        onClick={() => handleNavigate(row.idUbicacion)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FolderOpen fontSize="small" color="action" />
                                            {row.codigo}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{row.nombre}</TableCell>
                                    <TableCell>
                                        <Chip label={row.estado} size="small" 
                                              color={row.estado === 'Operativo' ? 'success' : 'error'} 
                                              variant="outlined" sx={{ fontWeight: 600 }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* Botón Restaurado: Ver Detalle */}
                                        <Tooltip title="Ver Detalle">
                                            <IconButton size="small" color="info" onClick={() => navigate(`/ubicaciones/${row.idUbicacion}`)}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="primary" onClick={() => navigate(`/ubicaciones/editar/${row.idUbicacion}`)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="Dar de Baja">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(row.idUbicacion, row.nombre)}>
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