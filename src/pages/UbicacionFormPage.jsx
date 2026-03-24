import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Card, Button, TextField, MenuItem, Grid, Avatar, Divider, CircularProgress, Breadcrumbs, Link
} from '@mui/material';
import { Save, ArrowBack, EditLocationAlt, AddLocationAlt, AccountTree } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

export default function UbicacionFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode); 
    const [saving, setSaving] = useState(false);        
    const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);
    
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: '',
        estado: 'Operativo',
        idPadre: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allUbicaciones = await ubicacionService.getAll();
                setUbicacionesDisponibles(allUbicaciones);

                if (isEditMode) {
                    const data = await ubicacionService.getById(id);
                    setFormData({
                        codigo: data.codigo || '',
                        nombre: data.nombre || '',
                        tipo: data.tipo || '',
                        estado: data.estado || 'Operativo',
                        idPadre: data.idPadre || ''
                    });
                }
            } catch (err) {
                console.error("Error al cargar datos:", err);
                alert("No se pudo cargar la información requerida.");
                navigate('/ubicaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...formData,
            idPadre: formData.idPadre === '' ? null : parseInt(formData.idPadre)
        };

        try {
            if (isEditMode) {
                await ubicacionService.update(id, payload);
            } else {
                await ubicacionService.create(payload);
            }
            navigate('/ubicaciones'); 
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error al guardar.";
            alert(`Error: ${errorMsg}`);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
            
            {/* Breadcrumbs estilo Dashboard */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/ubicaciones')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <AccountTree sx={{ mr: 0.5 }} fontSize="inherit" />
                    Ubicaciones Técnicas
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    {isEditMode ? 'Editar Nodo' : 'Nuevo Nodo'}
                </Typography>
            </Breadcrumbs>

            {/* Cabecera Principal */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }} variant="rounded">
                    {isEditMode ? <EditLocationAlt fontSize="large" /> : <AddLocationAlt fontSize="large" />}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" color="text.primary">
                        {isEditMode ? 'Editar Ubicación' : 'Registrar Ubicación'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Complete los datos técnicos para este nodo en la jerarquía de activos.
                    </Typography>
                </Box>
            </Box>

            {/* Contenedor del Formulario */}
            <Card>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        IDENTIFICACIÓN Y ESTADO
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Código Técnico" name="codigo" value={formData.codigo}
                                onChange={handleChange} required disabled={isEditMode}
                                helperText={isEditMode ? "El código es inmutable." : "Ej. PLANTA-01"}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Estado Operativo" name="estado" value={formData.estado}
                                onChange={handleChange} required
                            >
                                <MenuItem value="Operativo">Operativo</MenuItem>
                                <MenuItem value="EnReparacion">En Reparación</MenuItem>
                                <MenuItem value="FueraDeServicio">Fuera de Servicio</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        DETALLES DE LA UBICACIÓN
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Nombre / Descripción" name="nombre" value={formData.nombre}
                                onChange={handleChange} required placeholder="Ej. Línea de Ensamblaje Principal"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Tipo de Ubicación" name="tipo" value={formData.tipo}
                                onChange={handleChange} required placeholder="Ej. Edificio, Sector..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Dependencia (Nodo Padre)" name="idPadre" value={formData.idPadre}
                                onChange={handleChange} helperText="Deje en blanco si es nodo raíz."
                            >
                                <MenuItem value=""><em>-- Ninguna (Nodo Raíz) --</em></MenuItem>
                                {ubicacionesDisponibles
                                    .filter(ubi => !isEditMode || ubi.idUbicacion !== parseInt(id))
                                    .map(ubi => (
                                        <MenuItem key={ubi.idUbicacion} value={ubi.idUbicacion}>
                                            {ubi.codigo} - {ubi.nombre}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
                        <Button 
                            variant="outlined" onClick={() => navigate('/ubicaciones')}
                            startIcon={<ArrowBack />} disabled={saving}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" variant="contained" color="primary"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Confirmar Guardado'}
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}