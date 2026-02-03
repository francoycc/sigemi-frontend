import React, { useState, useEffect, use } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Chip, 
    IconButton, Tooltip, CircularProgress 
} from '@mui/material';
import { Add, Edit, Delete, Place } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

export default function Ubicaciones() {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async() =>{
        try{
            const data = await ubicacionService.getAll();
            setUbicaciones(data);
        } catch (error){
            console.error("Error cargando ubicaciones", error);
        } finally {    
            setLoading(true);
        }
    };

    return (
        <Box>
            {/*Header de ubicaciones*/}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Ubicaciones Técnicas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gestión de la estructura física de la planta y sectores.
                </Typography>
            </Box>
            <Button variant="contained" startIcon={<Add />} size="large" sx={{ px:3, borderRadius: 2 }}>
                Agregar Ubicación
            </Button>
        </Box>
        
        {/* Tabla de Datos */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#F5F5F5' }}>
                            <TableRow>
                                <TableCell fontWeight="bold">CÓDIGO</TableCell>
                                <TableCell fontWeight="bold">NOMBRE / DESCRIPCIÓN</TableCell>
                                <TableCell fontWeight="bold">PLANTA</TableCell>
                                <TableCell fontWeight="bold">ESTADO</TableCell>
                                <TableCell align="right" fontWeight="bold">ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : ubicaciones.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Place fontSize="small" color="action" />
                                            {row.codigo}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.nombre}</TableCell>
                                    <TableCell>{row.planta}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.estado} 
                                            size="small" 
                                            color={row.estado === 'Activo' ? 'success' : 'default'}
                                            variant="outlined" 
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton size="small" color="primary">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" color="error">
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
