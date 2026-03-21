import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, CircularProgress, Breadcrumbs, Link
} from '@mui/material';
import { Save, ArrowBack, AssignmentTurnedIn, Assignment, Dashboard as DashboardIcon } from '@mui/icons-material';
import tareaService from '../services/tareaService';
import ordenService from '../services/ordenService';
import usuarioService from '../services/usuarioService';

export default function TareaFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);        
    const [ordenes, setOrdenes] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    
    // Mapeo exacto a tu entidad backend
    const [formData, setFormData] = useState({
        tipo: 'Preventivo',
        descripcion: '',
        fechaEjecucion: '',
        estado: 'Pendiente',
        tiempoInvertidoHoras: '',
        ordenId: '',   
        tecnicoId: ''  
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [ordData, usrData] = await Promise.all([
                    ordenService.getAll(),
                    usuarioService.getAll() 
                ]);
                setOrdenes(ordData);
                setTecnicos(usrData);

                if (isEditMode) {
                    const data = await tareaService.getById(id);
                    setFormData({
                        tipo: data.tipo || 'Preventivo',
                        descripcion: data.descripcion || '',
                        fechaEjecucion: data.fechaEjecucion ? data.fechaEjecucion.split('T')[0] : '',
                        estado: data.estado || 'Pendiente',
                        tiempoInvertidoHoras: data.tiempoInvertidoHoras || '',
                        ordenId: data.orden?.idOrden || '',
                        tecnicoId: data.tecnico?.idUsuario || ''
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

        const payload = {
            ...formData,
            tiempoInvertidoHoras: formData.tiempoInvertidoHoras === '' ? null : parseFloat(formData.tiempoInvertidoHoras),
            ordenId: formData.ordenId === '' ? null : parseInt(formData.ordenId),
            tecnicoId: formData.tecnicoId === '' ? null : parseInt(formData.tecnicoId)
        };

        try {
            if (isEditMode) {
                await tareaService.update(id, payload);
            } else {
                await tareaService.create(payload);
            }
            navigate('/tareas'); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Verifique los campos ingresados.";
            alert(`Error al guardar: ${errorMsg}`);
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
            
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
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
                        {isEditMode ? 'Modificar Tarea' : 'Creación de Tarea'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Especifique los detalles de ejecución e imputación de tiempos.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, bgcolor: '#FFFFFF' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Tipo de Mantenimiento" name="tipo" 
                                value={formData.tipo} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Preventivo">Preventivo</MenuItem>
                                <MenuItem value="Correctivo">Correctivo</MenuItem>
                                <MenuItem value="Predictivo">Predictivo</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth type="date" label="Fecha de Ejecución" name="fechaEjecucion" 
                                value={formData.fechaEjecucion} onChange={handleChange} required
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Estado de la Tarea" name="estado" 
                                value={formData.estado} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="EnProgreso">En Progreso</MenuItem>
                                <MenuItem value="Completada">Completada</MenuItem>
                                <MenuItem value="Cancelada">Cancelada</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={4} label="Descripción del Trabajo" name="descripcion" 
                                value={formData.descripcion} onChange={handleChange} required
                                placeholder="Detalle los procedimientos a ejecutar o ejecutados..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth select label="Vincular a Orden" name="ordenId" 
                                value={formData.ordenId} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {ordenes.map(ord => (
                                    <MenuItem key={ord.idOrden} value={ord.idOrden}>
                                        #{ord.codigoOrden} - {ord.estado}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth select label="Técnico Responsable" name="tecnicoId" 
                                value={formData.tecnicoId} onChange={handleChange} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value=""><em>-- Seleccione --</em></MenuItem>
                                {tecnicos.map(tec => (
                                    <MenuItem key={tec.idUsuario} value={tec.idUsuario}>
                                        {tec.username}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth type="number" inputProps={{ step: "0.5" }} 
                                label="Tiempo Invertido (Hs)" name="tiempoInvertidoHoras" 
                                value={formData.tiempoInvertidoHoras} onChange={handleChange}
                                placeholder="Ej. 2.5"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
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
                            {saving ? 'Guardando...' : 'Guardar Tarea'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}