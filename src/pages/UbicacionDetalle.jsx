import React, { useState, useEffect }from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Divider, Grid, Avatar, 
    Chip, Button, CircularProgress, CardContent} from '@mui/material';
import { ArrowBack, PrecisionManufacturing, Edit, Bussines, 
    ViewModule, Place, EventNote
 } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';


export default function UbicacionDetalle() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [ubicacion, setUbicacion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async() => {
        try {
            const data = await ubicacionService.getById(id);
            setUbicacion(data);
        } catch (error) {
            console.error('Error al cargar ubicación:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx = {{ display: 'flex', justifyContent: 'center', mt: 10}}>
                <CircularProgress />
            </Box>
        );
    }

    if (!ubicacion) {
        return <Typography> Ubicación no encontrada.</Typography>;
    }

    const getIcon = () => {
        switch (ubicacion.tipo) {
            case 'Planta': return <Bussines fontSize="large"/>;
            case 'Línea': return <PrecisionManufacturing fontSize ="large"/>;
            default: return <ViewModule fontSize="large"/>;
        }
    };
    
    return (
        <Box>
            {/*Header con boton volver*/}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4}}>
                <Button startIcon={<ArrowBack />} 
                onClick={() => navigate('/ubicaciones')}
                sx={{ mr: 2 }}>
                    Volver
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Detalle de Ubicación
                </Typography>
            </Box>

            {/* Tarjeta principal de Información */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{
                        width: 80, height: 80,
                        bgcolor: 'primary.main', 
                        mr: 3,
                        boxShadow: '0 4px 12px rgba(21, 101, 192 ,0.2)'
                    }}>
                        {getIcon()}
                    </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {ubicacion.nombre}    
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                            icon ={<Place fontSize = 'small'/>} 
                            label={ubicacion.codigo}
                            sx={{ fontWeight: 'bold', borderRadius: 1}}
                        />
                        <Chip 
                            label={ubicacion.tipo} 
                            color="primary" 
                            variant = "outlined"
                            sx = {{ fontWeight: 'bold', borderRadius: 1}}    
                        />
                        <Chip 
                                label={ubicacion.estado} 
                                color={ubicacion.estado === 'Activo' ? 'success' : 'default'} 
                                sx={{ fontWeight: 'bold', borderRadius: 1 }} 
                            />
                    </Box>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                        <Button variant="contained" startIcon={<Edit />}>
                            Editar
                        </Button>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" sx={{ mb: 2 }}>
                            Información General
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="caption" color="text.secondary">ID SISTEMA</Typography>
                                        <Typography variant="h6">{ubicacion.idUbicacion}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="caption" color="text.secondary">JERARQUÍA</Typography>
                                        <Typography variant="h6">
                                            {ubicacion.idPadre ? `Sub-nivel` : 'Raíz'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" sx={{ mb: 2 }}>
                            Estadísticas (Proyección)
                        </Typography>
                        <Card variant="outlined" sx={{ bgcolor: '#FAFAFA' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                    <EventNote />
                                    <Typography>Historial de mantenimientos no disponible.</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}