import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import { 
    Add, Edit, FolderOpen, AccountTree, Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ubicacionService from '../services/ubicacionService';
import UbicacionBreadcrumbs from '../components/UbicacionBreadcrumbs';

export default function Ubicaciones() {
    const navigate = useNavigate(); // Hook de navegación
    const [currentId, setCurrentId] = useState(null);
    const [children, setChildren] = useState([]);
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadView(currentId);
    }, [currentId]);

    const loadView = async (id) => {
        setLoading(true);
        try {
            const data = await ubicacionService.getByParentId(id);
            setChildren(data);

            if (id === null) {
                setPath([]);
            } else {
                const currentNode = await ubicacionService.getById(id);
                const existingIndex = path.findIndex(p => p.idUbicacion === id);
                if (existingIndex === -1) {
                    setPath(prev => [...prev, currentNode]);
                } else {
                    setPath(prev => prev.slice(0, existingIndex + 1));
                }
            }
        } catch (error) {
            console.error("Error cargando jerarquía", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (id) => {
        setCurrentId(id);
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
                <Button variant="contained" startIcon={<Add />} sx={{ px: 3, borderRadius: 2 }}>
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
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>TIPO</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : children.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No hay elementos hijos en este nivel.
                                    </TableCell>
                                </TableRow>
                            ) : children.map((row) => (
                                <TableRow key={row.idUbicacion} hover>
                                    {/* Clic en Código -> BAJA DE NIVEL (Navegación Jerárquica) */}
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
                                        <Chip label={row.tipo} size="small" sx={{ borderRadius: 1, fontWeight: 500, bgcolor: '#E3F2FD', color: '#1565C0' }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Ver Detalle Completo">
                                            {/* Clic en Ojo -> VA A LA PANTALLA DE DETALLE (Nueva Ruta) */}
                                            <IconButton 
                                                size="small" 
                                                color="primary" 
                                                onClick={() => navigate(`/ubicaciones/${row.idUbicacion}`)}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Navegar dentro">
                                            <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => handleNavigate(row.idUbicacion)}>
                                                <FolderOpen fontSize="small" />
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