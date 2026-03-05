import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Chip, Divider, Grid, 
    CircularProgress, Avatar, Card, CardContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton
} from '@mui/material';
import { 
    ArrowBack, Edit, Business, PrecisionManufacturing, 
    ViewModule, Place, Visibility, AddCircleOutline, SettingsInputComponent
} from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';
import UbicacionForm from '../components/UbicacionForm';

// Simula los equipos que devuelve el backend
const MOCK_EQUIPOS = [
    { id: 101, tag: 'MOT-BMB-01', nombre: 'Motor Bomba Principal', estado: 'Operativo', criticidad: 'Alta' },
    { id: 102, tag: 'VAL-HID-05', nombre: 'Válvula Hidráulica', estado: 'Operativo', criticidad: 'Media' },
    { id: 103, tag: 'SENS-TMP-02', nombre: 'Sensor de Temperatura', estado: 'FueraDeServicio', criticidad: 'Baja' },
];

export default function UbicacionDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ubicacion, setUbicacion] = useState(null);
    const [equipos, setEquipos] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            console.log("Cargando detalle para ID:", id);
            const dataUbicacion = await ubicacionService.getById(id);
            setUbicacion(dataUbicacion);

            // Simular carga de equipos
            setEquipos(MOCK_EQUIPOS);

        } catch (error) {
            console.error("Error cargando detalle:", error);
            navigate('/ubicaciones'); 
        } finally {
            setLoading(false);
        }
    };

    // --- GUARDAR EDICION ---
    const handleUpdateSubmit = async (formData) => {
        try {
            console.log("Datos recibidos del formulario para actualización:", formData);
            const updatedData = await ubicacionService.update(id, formData);
            setUbicacion(updatedData); 
            setFormOpen(false); 
        } catch (error) {
            console.error("Error actualizando datos:", error);
            alert(error.response?.data?.message || "Ocurrió un error al actualizar los datos.");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!ubicacion) return null;

    // icono en la cabecera
    const getIcon = () => {
        switch(ubicacion.tipo) {
            case 'Planta': return <Business fontSize="large" />;
            case 'Línea': return <PrecisionManufacturing fontSize="large" />;
            default: return <ViewModule fontSize="large" />;
        }
    };

    return (
        <Box>
            {/* Cabecera Superior */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/ubicaciones')} sx={{ mr: 2, color: 'text.secondary' }}>
                    Volver a Jerarquía
                </Button>
            </Box>

            {/* TARJETA DE RESUMEN */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4, bgcolor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 70, height: 70, bgcolor: 'primary.main', mr: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            {getIcon()}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5, color: '#1a1a1a' }}>
                                {ubicacion.nombre}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip icon={<Place fontSize="small"/>} label={ubicacion.codigo} size="small" sx={{ fontWeight: 600, bgcolor: '#f0f0f0' }} />
                                <Chip label={ubicacion.tipo} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                                <Chip 
                                    label={ubicacion.estado === 'Operativo' ? 'Operativo' : 'Fuera de Servicio'} 
                                    size="small" 
                                    color={ubicacion.estado === 'Operativo' ? 'success' : 'error'} 
                                    sx={{ fontWeight: 600 }} 
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Button variant="contained" startIcon={<Edit />} onClick={() => setFormOpen(true)}>
                        Editar Información
                    </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#fafafa', border: 'none' }}>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">IDENTIFICADOR DE SISTEMA</Typography>
                                <Typography variant="h6" fontWeight="600">{ubicacion.idUbicacion}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#fafafa', border: 'none' }}>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary" fontWeight="bold">UBICACIÓN PADRE</Typography>
                                <Typography variant="h6" fontWeight="600">
                                    {ubicacion.idPadre ? `ID: ${ubicacion.idPadre}` : 'Nivel Principal (Raíz)'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#e3f2fd', border: 'none' }}>
                            <CardContent>
                                <Typography variant="caption" color="primary" fontWeight="bold">EQUIPOS INSTALADOS</Typography>
                                <Typography variant="h6" color="primary.dark" fontWeight="600">{equipos.length} Equipos</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* TABLA DE EQUIPOS ASOCIADOS */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsInputComponent color="primary" /> Equipos en esta Ubicación
                    </Typography>
                    <Button variant="outlined" size="small" startIcon={<AddCircleOutline />}>
                        Vincular Equipo
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>TAG / CÓDIGO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>NOMBRE DEL EQUIPO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ESTADO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>CRITICIDAD</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {equipos.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No hay equipos registrados aquí.</TableCell></TableRow>
                            ) : equipos.map((eq) => (
                                <TableRow key={eq.id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.secondary' }}>{eq.tag}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{eq.nombre}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: eq.estado === 'Operativo' ? 'success.main' : 'error.main', fontWeight: 500 }}>
                                            {eq.estado === 'Operativo' ? 'En Servicio' : 'En Reparación'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={eq.criticidad} size="small" 
                                            color={eq.criticidad === 'Alta' ? 'error' : eq.criticidad === 'Media' ? 'warning' : 'default'} 
                                            variant="outlined" sx={{ fontWeight: 'bold' }} 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Ver Ficha Técnica">
                                            <IconButton size="small" color="primary" onClick={() => navigate(`/equipos/${eq.id}`)}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* EDICIÓN */}
            <UbicacionForm 
                open={formOpen} 
                onClose={() => setFormOpen(false)} 
                onSubmit={handleUpdateSubmit}
                initialData={ubicacion} 
            />
        </Box>
    );
}