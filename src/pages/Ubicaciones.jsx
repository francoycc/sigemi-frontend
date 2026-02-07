import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import { Add, Edit, FolderOpen, AccountTree } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';
import UbicacionBreadcrumbs from '../components/UbicacionBreadcrumbs';

export default function Ubicaciones() {
    // ID de la ubicación actual que estamos viendo (null = Raíz)
    const [currentId, setCurrentId] = useState(null);
    // Lista de ubicaciones hijas de la actual
    const [children, setChildren] = useState([]);
    //  Ruta completa para el breadcrumb (Array de objetos)
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carga los datos cada vez que cambia el currentId
    useEffect(() => {
        loadView(currentId);
    }, [currentId]);

    // Carga hijos y reconstruye el path
    const loadView = async (id) => {
        setLoading(true);
        try {
            const data = await ubicacionService.getByParentId(id);
            setChildren(data);

            // Reconstruir el path 
            if (id === null) {
                setPath([]);
            } else {
                //  agregamos el nodo actual al path existente
                const currentNode = await ubicacionService.getById(id);
                
                const existingIndex = path.findIndex(p => p.id === id);
                if (existingIndex >= 0) {
                    setPath(path.slice(0, existingIndex + 1));
                } else {
                    setPath(prev => [...prev, currentNode]);
                }
            }
        } catch (error) {
            console.error("Error cargando jerarquía", error);
        } finally {
            setLoading(false);
        }
    };

    // Handler para navegar 
    const handleNavigate = (id) => {
        setCurrentId(id);
    };

    return (
        <Box>
            {/* Encabezado con icono de jerarquía */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }} variant="rounded">
                        <AccountTree />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Estructura de Activos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Navegue por la jerarquía de plantas y sectores.
                        </Typography>
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ px: 3, borderRadius: 2 }}>
                    Nuevo Nodo
                </Button>
            </Box>
            
            {/* Breadcrumbs de Navegación */}
            <UbicacionBreadcrumbs path={path} onNavigate={handleNavigate} />

            {/* Tabla de Resultados */}
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
                                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {/* Clic en el código para navegar */}
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
                                               onClick={() => handleNavigate(row.id)}>
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
                                        <Tooltip title="Navegar dentro">
                                            <IconButton size="small" color="primary" onClick={() => handleNavigate(row.id)}>
                                                <FolderOpen fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                                <Edit fontSize="small" />
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