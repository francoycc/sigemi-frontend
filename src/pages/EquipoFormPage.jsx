import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, Divider, CircularProgress, Breadcrumbs, Link
} from '@mui/material';
import { Save, ArrowBack, Build, BuildCircle, Inventory } from '@mui/icons-material';
import equipoService from '../services/equipoService';
import ubicacionService from '../services/ubicacionService';

export default function EquipoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);        
    const [ubicaciones, setUbicaciones] = useState([]);
    
    const [formData, setFormData] = useState({
        codigoEquipo: '',
        nombre: '',
        marca: '',
        modelo: '',
        numeroSerie: '',
        fechaIncorporacion: '',
        estadoOperativo: 'Operativo',
        criticidad: 'Media',
        ubicacionTecnicaId: '' // FK hacia Ubicación Técnica
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // cargar equipos
                console.log("Cargando datos para el formulario de equipo...");
                const ubiData = await ubicacionService.getAll();
                setUbicaciones(ubiData);

                // Editar
                if (isEditMode) {
                    console.log(`Cargando datos del equipo ID ${id} para edición...`);
                    const data = await equipoService.getById(id);
                    setFormData({
                        codigoEquipo: data.codigoEquipo || '',
                        nombre: data.nombre || '',
                        marca: data.marca || '',
                        modelo: data.modelo || '',
                        numeroSerie: data.numeroSerie || '',
                        fechaIncorporacion: data.fechaIncorporacion ? data.fechaIncorporacion.split('T')[0] : '', // Formato input date
                        estadoOperativo: data.estadoOperativo || 'Operativo',
                        criticidad: data.criticidad || 'Media',
                        ubicacionTecnicaId: data.ubicacionTecnica?.idUbicacion || ''
                    });
                }
            } catch (err) {
                console.error("Error inicializando el formulario:", err);
                alert("Hubo un error al cargar la información requerida.");
                navigate('/equipos');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
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
            // Aseguramos de mandar null 
            ubicacionTecnica: formData.ubicacionTecnicaId ? { idUbicacion: parseInt(formData.ubicacionTecnicaId) } : null
        };

        try {
            if (isEditMode) {
                console.log(`Guardando cambios para equipo ID ${id}...`);
                await equipoService.update(id, payload);
            } else {
                console.log("Creando nuevo equipo...");
                await equipoService.create(payload);
            }
            navigate('/equipos'); 
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Verifique los campos ingresados.";
            alert(`Error al guardar: ${errorMsg}`);
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
            
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/equipos')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Inventory sx={{ mr: 0.5 }} fontSize="inherit" /> Equipos
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    {isEditMode ? 'Editar Equipo' : 'Nuevo Equipo'}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 56, height: 56 }} variant="rounded">
                    {isEditMode ? <BuildCircle fontSize="large" /> : <Build fontSize="large" />}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" color="text.primary">
                        {isEditMode ? 'Modificar Equipo' : 'Alta de Equipo'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Complete la ficha técnica para registrar la máquina o componente.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, bgcolor: '#FFFFFF' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        IDENTIFICACIÓN TÉCNICA
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth label="Código de Equipo" name="codigoEquipo" value={formData.codigoEquipo}
                                onChange={handleChange} required disabled={isEditMode}
                                helperText={isEditMode ? "El código es inmutable." : "Ej. MOT-001"}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth label="Nombre del Equipo" name="nombre" value={formData.nombre}
                                onChange={handleChange} required placeholder="Ej. Motor de Bomba Centrífuga"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth label="Marca" name="marca" value={formData.marca}
                                onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth label="Modelo" name="modelo" value={formData.modelo}
                                onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth label="Número de Serie" name="numeroSerie" value={formData.numeroSerie}
                                onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        ESTADO Y UBICACIÓN
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Asignación a Ubicación Técnica" name="ubicacionTecnicaId" value={formData.ubicacionTecnicaId}
                                onChange={handleChange} required helperText="Nodo donde se encuentra instalado."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value=""><em>-- Seleccione Ubicación --</em></MenuItem>
                                {ubicaciones.map(ubi => (
                                    <MenuItem key={ubi.idUbicacion} value={ubi.idUbicacion}>
                                        {ubi.codigo} - {ubi.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="date" label="Fecha de Incorporación" name="fechaIncorporacion" value={formData.fechaIncorporacion}
                                onChange={handleChange} required InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Estado Operativo" name="estadoOperativo" value={formData.estadoOperativo}
                                onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Operativo">Operativo</MenuItem>
                                <MenuItem value="EnReparacion">En Reparación</MenuItem>
                                <MenuItem value="FueraDeServicio">Fuera de Servicio</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Nivel de Criticidad" name="criticidad" value={formData.criticidad}
                                onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Baja">Baja</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Alta">Alta</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
                        <Button 
                            variant="outlined" color="inherit" onClick={() => navigate('/equipos')}
                            startIcon={<ArrowBack />} disabled={saving}
                            sx={{ color: 'text.secondary', borderColor: 'divider', borderRadius: 2, px: 3 }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" variant="contained" color="primary"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            disabled={saving}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                        >
                            {saving ? 'Procesando...' : 'Confirmar Registro'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}