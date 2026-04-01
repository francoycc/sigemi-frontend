import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, Divider, CircularProgress, Breadcrumbs, Link
} from '@mui/material';
import { Save, ArrowBack, ConfirmationNumber, Dashboard as DashboardIcon } from '@mui/icons-material';
import ordenService from '../services/ordenService';
import equipoService from '../services/equipoService';
import usuarioService from '../services/usuarioService';

export default function OrdenFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);        
    
    // Catálogos para los selects
    const [equipos, setEquipos] = useState([]);
    const [supervisores, setSupervisores] = useState([]);
    
    // Estado del formulario mapeado al OrdenDTO
    const [formData, setFormData] = useState({
        tipo: 'Preventivo',
        prioridad: 'Media',
        estado: 'Pendiente',
        descripcion: '',
        fechaCreacion: new Date().toISOString().split('T')[0], // Por defecto hoy
        fechaInicio: '',
        fechaFin: '',
        idEquipo: '',   
        idSupervisor: ''  
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Cargamos equipos y usuarios en paralelo
                const [eqData, usrData] = await Promise.all([
                    equipoService.getAll(),
                    usuarioService.getAll() 
                ]);
                
                setEquipos(eqData || []);
                setSupervisores(usrData || []);

                if (isEditMode) {
                    const data = await ordenService.getById(id);
                    setFormData({
                        tipo: data.tipo || 'Preventivo',
                        prioridad: data.prioridad || 'Media',
                        estado: data.estado || 'Pendiente',
                        descripcion: data.descripcion || '',
                        fechaCreacion: data.fechaCreacion ? data.fechaCreacion.split('T')[0] : '',
                        fechaInicio: data.fechaInicio ? data.fechaInicio.split('T')[0] : '',
                        fechaFin: data.fechaFin ? data.fechaFin.split('T')[0] : '',
                        idEquipo: data.idEquipo || '',
                        idSupervisor: data.idSupervisor || ''
                    });
                }
            } catch (err) {
                console.error("Error cargando dependencias:", err);
                alert("Error al cargar la información requerida de la BD.");
                navigate('/ordenes');
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

        // Preparamos el payload exacto que el Backend espera en el OrdenDTO
        const payload = {
            ...formData,
            idEquipo: formData.idEquipo === '' ? null : parseInt(formData.idEquipo),
            idSupervisor: formData.idSupervisor === '' ? null : parseInt(formData.idSupervisor)
        };

        try {
            if (isEditMode) {
                await ordenService.update(id, payload);
            } else {
                await ordenService.create(payload);
            }
            navigate('/ordenes'); 
        } catch (err) {
            console.error("Error devuelto por el servidor:", err.response?.data);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Verifique los campos requeridos.";
            alert(`Error al guardar: ${errorMsg}`);
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
            
            {/* Navegación */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer' }}>
                    <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate('/ordenes')} sx={{ cursor: 'pointer' }}>
                    Órdenes
                </Link>
                <Typography color="text.primary" fontWeight="bold">
                    {isEditMode ? 'Editar Orden' : 'Nueva Orden'}
                </Typography>
            </Breadcrumbs>

            {/* Cabecera */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, boxShadow: 1 }} variant="rounded">
                    <ConfirmationNumber fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" color="text.primary">
                        {isEditMode ? 'Modificar Orden de Mantenimiento' : 'Crear Orden de Mantenimiento'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Complete los datos para generar una nueva solicitud de trabajo.
                    </Typography>
                </Box>
            </Box>

            {/* Formulario */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, bgcolor: '#FFFFFF' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    {/* SECCIÓN 1: Detalles Generales */}
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        DETALLES GENERALES
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Tipo de Mantenimiento" name="tipo" 
                                value={formData.tipo} onChange={handleChange} required
                            >
                                <MenuItem value="Preventivo">Preventivo</MenuItem>
                                <MenuItem value="Correctivo">Correctivo</MenuItem>
                                <MenuItem value="Predictivo">Predictivo</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Prioridad" name="prioridad" 
                                value={formData.prioridad} onChange={handleChange} required
                            >
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Estado de la Orden" name="estado" 
                                value={formData.estado} onChange={handleChange} required
                            >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="EnProgreso">En Progreso</MenuItem>
                                <MenuItem value="Completada">Completada</MenuItem>
                                <MenuItem value="Cancelada">Cancelada</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={4} label="Descripción del Problema / Trabajo" name="descripcion" 
                                value={formData.descripcion} onChange={handleChange} required
                                placeholder="Describa el motivo de la orden o el problema reportado..."
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* SECCIÓN 2: Asignaciones */}
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        ASIGNACIONES
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Equipo Objetivo" name="idEquipo" 
                                value={formData.idEquipo} onChange={handleChange} required
                                helperText="Seleccione el equipo que requiere mantenimiento"
                            >
                                <MenuItem value=""><em>-- Seleccione un Equipo --</em></MenuItem>
                                {equipos.map(eq => (
                                    <MenuItem key={eq.idEquipo || eq.id} value={eq.idEquipo || eq.id}>
                                        {eq.nombre} - {eq.codigo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Supervisor Asignado" name="idSupervisor" 
                                value={formData.idSupervisor} onChange={handleChange}
                                helperText="Persona responsable de autorizar la orden"
                            >
                                <MenuItem value=""><em>-- Sin Asignar --</em></MenuItem>
                                {supervisores.map(usr => (
                                    <MenuItem key={usr.idUsuario || usr.id} value={usr.idUsuario || usr.id}>
                                        {usr.username} ({usr.rol})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* SECCIÓN 3: Cronograma */}
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        CRONOGRAMA
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="Fecha de Creación" name="fechaCreacion" 
                                value={formData.fechaCreacion} onChange={handleChange} required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="Fecha de Inicio Real" name="fechaInicio" 
                                value={formData.fechaInicio} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="Fecha de Finalización" name="fechaFin" 
                                value={formData.fechaFin} onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    {/* Botones de Acción */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
                        <Button 
                            variant="outlined" color="inherit" onClick={() => navigate('/ordenes')}
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
                            {saving ? 'Guardando...' : 'Guardar Orden'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}