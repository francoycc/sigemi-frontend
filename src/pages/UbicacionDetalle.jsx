import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, Chip, Divider, Avatar, Card, CardContent, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton,
    CircularProgress, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { 
    ArrowBack, Edit, Business, PrecisionManufacturing, 
    ViewModule, Place, EventNote, Visibility, AddCircleOutline, ExpandMore 
} from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

// --- MOCK DE EQUIPOS ASOCIADOS (Columnas imagen 1) ---
const MOCK_EQUIPOS = [
    { id: 101, tag: 'MOT-BMB-01', nombre: 'Motor Bomba Principal', estado: 'Operativo', durencia: 'Baja' },
    { id: 102, tag: 'VAL-HID-05', nombre: 'Válvula Hidráulica', estado: 'Operativo', durencia: 'Media' },
    { id: 103, tag: 'SENS-TMP-02', nombre: 'Sensor de Temperatura', estado: 'FueraDeServicio', durencia: 'Alta' },
];

export default function UbicacionDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ubicacion, setUbicacion] = useState(null);
    const [equipos, setEquipos] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Cargar datos reales de la ubicación
            const dataUbicacion = await ubicacionService.getById(id);
            setUbicacion(dataUbicacion);

            // Simular carga de equipos (vincular luego con equipoService.getByUbicacion(id))
            setEquipos(MOCK_EQUIPOS);

        } catch (error) {
            console.error("Error cargando detalle:", error);
            navigate('/ubicaciones'); 
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!ubicacion) return null;

    // Icono dinámico para el header
    const getIcon = () => {
        switch(ubicacion.tipo) {
            case 'Planta': return <Business fontSize="large" />;
            case 'Línea': return <PrecisionManufacturing fontSize="large" />;
            default: return <ViewModule fontSize="large" />;
        }
    };

    return (
        <Box>
            {/* Cabecera Superior con Botón Volver y Nueva Sub-ubicación (Stitch Style) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate('/ubicaciones')} sx={{ mr: 2, borderRadius: 2, color: 'text.secondary' }}>
                        Volver a Jerarquía
                    </Button>
                    <Typography variant="h5" fontWeight="bold">Detalles del Activo</Typography>
                </Box>
                <Button variant="outlined" startIcon={<AddCircleOutline />} color="secondary" sx={{ borderRadius: 2 }}>
                    Nueva Sub-ubicación
                </Button>
            </Box>

            {/* TARJETA DE RESUMEN PRINCIPAL (Cabecera imagen 1) */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4, bgcolor: '#ffffff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', mr: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        {getIcon()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>{ubicacion.nombre}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip icon={<Place fontSize="small"/>} label={`CÓDIGO: ${ubicacion.codigo}`} size="small" sx={{ fontWeight: 600, bgcolor: '#f0f0f0', borderRadius: 1 }} />
                            <Chip label={`TIPO: ${ubicacion.tipo}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1 }} />
                            <Chip 
                                label={ubicacion.estado === 'Operativo' ? '✅ OPERATIVO' : '🔧 FUERA DE SERVICIO'} 
                                size="small" 
                                color={ubicacion.estado === 'Operativo' ? 'success' : 'error'} 
                                sx={{ fontWeight: 600, borderRadius: 1 }} 
                            />
                        </Box>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/ubicaciones/${id}/editar`)} sx={{ borderRadius: 2 }}>
                            EDITAR INFO
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    {/* Grid 2 Columnas (Imagen 1) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" color="text.secondary" sx={{ mb: 2 }}>Información General</Typography>
                        
                        {/* Items tipo acordeón/lista (Imagen 1) */}
                        {[
                            { title: 'ID Sistema', value: ubicacion.idUbicacion, icon: <Place fontSize="small"/> },
                            { title: 'Ubicación Padre', value: ubicacion.idPadre ? `ID: ${ubicacion.idPadre}` : 'Nivel Raíz', icon: <AccountTree fontSize="small"/> },
                            { title: 'Criticidad', value: 'Alta (A1)', icon: <ViewModule fontSize="small"/> },
                        ].map((item, index) => (
                            <Accordion key={index} disableGutters elevation={0} square={false} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1.5 }}>
                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>{item.icon}</Box>
                                    <Typography variant="body2" sx={{ ml: 1.5, fontWeight: 500 }}>{item.title}</Typography>
                                    <Typography variant="body2" sx={{ ml: 'auto', pr: 2, fontWeight: 700, color: 'text.primary' }}>{item.value}</Typography>
                                </AccordionSummary>
                                <AccordionDetails><Typography variant="caption" color="text.secondary">Detalles sobre {item.title}. No disponible en la versión actual.</Typography></AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                    
                    {/* Datos Operativos (Métrica Chips Imagen 1) */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" color="text.secondary" sx={{ mb: 2 }}>Datos de Operación (Proyección)</Typography>
                        <Grid container spacing={2}>
                            {[ {t: 'MTBF (Tiempo Operativo)', v: '99.8%', c: 'success.main'}, {t: 'Alertas Activas', v: '0', c: 'warning.main'}, {t: 'Ordenes Abiertas', v: '2', c: 'primary.main'}].map(stat => (
                                <Grid size={{ xs: 6 }} key={stat.t}>
                                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#FAFBFD', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">{stat.t}</Typography>
                                        <Typography variant="h5" fontWeight="700" color={stat.c}>{stat.v}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* --- SECCIÓN NUEVA: TABLA DE EQUIPOS ASOCIADOS (Tabla imagen 1) --- */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Typography variant="h6" fontWeight="bold">Equipos Asociados</Typography>
                    <Button variant="contained" size="small" startIcon={<AddCircleOutline />} color="primary" sx={{ borderRadius: 2 }}>
                        VINCULAR EQUIPO
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                            <TableRow>
                                <TableCell fontWeight="600">CÓDIGO 700</TableCell>
                                <TableCell fontWeight="600">TIPO</TableCell>
                                <TableCell fontWeight="600">DEPENDENCIA 700</TableCell>
                                <TableCell fontWeight="600">ESTADO 700</TableCell>
                                <TableCell fontWeight="600" align="right">ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {equipos.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No hay equipos vinculados a este activo industrial.</TableCell></TableRow>
                            ) : equipos.map((eq) => (
                                <TableRow key={eq.id} hover>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{eq.tag}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{eq.nombre}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>{ubicacion.codigo}</TableCell>
                                    <TableCell>
                                        <Chip label={eq.estado === 'Operativo' ? 'OPERATIVO' : 'FUERA DE SERVICIO'} size="small" 
                                              color={eq.estado === 'Operativo' ? 'success' : 'warning'} 
                                              sx={{ fontWeight: 700, borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Ver Detalle del Equipo">
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
        </Box>
    );
}