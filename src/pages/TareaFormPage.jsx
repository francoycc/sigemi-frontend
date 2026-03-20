import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, Divider, CircularProgress, Breadcrumbs, Link
} from '@mui/material';
import { Save, ArrowBack, Assignment, AssignmentTurnedIn, Dashboard as DashboardIcon } from '@mui/icons-material';
import tareaService from '../services/tareaService';
import equipoService from '../services/equipoService';

export default function TareaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);        
    const [equipos, setEquipos] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipoMantenimiento: 'Preventivo',
        estadoTarea: 'Pendiente',
        tiempoEstimado: '',
        equipoId: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Cargar catálogo de equipos disponibles
                console.log("Cargando equipos para asignación...");
                const eqData = await equipoService.getAll();
                setEquipos(eqData);

                if (isEditMode) {
                    const data = await tareaService.getById(id);
                    setFormData({
                        nombre: data.nombre || '',
                        descripcion: data.descripcion || '',
                        tipoMantenimiento: data.tipoMantenimiento || 'Preventivo',
                        estadoTarea: data.estadoTarea || 'Pendiente',
                        tiempoEstimado: data.tiempoEstimado || '',
                        equipoId: data.equipo?.idEquipo || ''
                    });
                }
            } catch (err) {
                alert("Error al cargar la información requerida.");
                navigate('/tareas');
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

        const data = {
            ...formData,
            tiempoEstimado: formData.tiempoEstimado === '' ? null : parseInt(formData.tiempoEstimado),
            equipoId: formData.equipoId === '' ? null : parseInt(formData.equipoId)
        };

        try {
            if (isEditMode) {
                console.log(`Guardando cambios para tarea ${id}...`, data);
                await tareaService.update(id, data);
            } else {
                console.log("Creando nueva tarea...", data);
                await tareaService.create(data);
            }
            navigate('/tareas'); 
        } catch (err) {
            console.error(err);
            alert(`Error al guardar la tarea.`);
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
            
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/tareas')} sx={{ cursor: 'pointer' }}>
                    Tareas
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    {isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }} variant="rounded">
                    {isEditMode ? <AssignmentTurnedIn fontSize="large" /> : <Assignment fontSize="large" />}
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" color="text.primary">
                        {isEditMode ? 'Modificar Tarea' : 'Registrar Nueva Tarea'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Especifique la actividad técnica y asigne un equipo objetivo.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, bgcolor: '#FFFFFF' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        DETALLES DE LA ACTIVIDAD
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Título de la Tarea" name="nombre" value={formData.nombre}
                                onChange={handleChange} required placeholder="Ej. Cambio de rodamientos de motor"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={3} label="Descripción del Trabajo" name="descripcion" 
                                value={formData.descripcion} onChange={handleChange} required
                                placeholder="Describa los pasos a seguir o el problema reportado."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Tipo de Mantenimiento" name="tipoMantenimiento" 
                                value={formData.tipoMantenimiento} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Preventivo">Preventivo (Programado)</MenuItem>
                                <MenuItem value="Correctivo">Correctivo (Reparación)</MenuItem>
                                <MenuItem value="Predictivo">Predictivo (Inspección)</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth type="number" label="Tiempo Estimado (Minutos)" name="tiempoEstimado" 
                                value={formData.tiempoEstimado} onChange={handleChange}
                                placeholder="Ej. 120"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        ASIGNACIÓN Y ESTADO
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth select label="Equipo Asociado (Objetivo)" name="equipoId" 
                                value={formData.equipoId} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value=""><em>-- Seleccione un Equipo --</em></MenuItem>
                                {equipos.map(eq => (
                                    <MenuItem key={eq.idEquipo} value={eq.idEquipo}>
                                        {eq.codigoEquipo} - {eq.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Estado Actual" name="estadoTarea" 
                                value={formData.estadoTarea} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="EnProgreso">En Progreso</MenuItem>
                                <MenuItem value="Completada">Completada</MenuItem>
                                <MenuItem value="Cancelada">Cancelada</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
                        <Button 
                            variant="outlined" color="inherit" onClick={() => navigate('/tareas')}
                            startIcon={<ArrowBack />} disabled={saving}
                            sx={{ color: 'text.secondary', borderColor: 'divider', borderRadius: 2, px: 3 }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" variant="contained" color="info"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            disabled={saving}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                        >
                            {saving ? 'Guardando...' : 'Confirmar Tarea'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}