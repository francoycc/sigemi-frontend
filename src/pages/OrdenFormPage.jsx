import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, Divider, 
    CircularProgress, Breadcrumbs, Link, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Save, ArrowBack, ConfirmationNumber, Dashboard as DashboardIcon, Add, Delete, Build } from '@mui/icons-material';
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
    const [tecnicosYSupervisores, setTecnicosYSupervisores] = useState([]); // Usamos el mismo catálogo para ambos roles por ahora
    
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
        idSupervisor: '',
        tareas: [] 
    });

    // Estado para la Tarea que se está escribiendo
    const [nuevaTarea, setNuevaTarea] = useState({
        descripcion: '',
        tecnicoId: '',
        tipo: 'Preventivo',
        estado: 'Pendiente',
        fechaEjecucion: new Date().toISOString().split('T')[0]
    });

    // Helper seguro para IDs
    const getId = (obj, prefijo) => {
        if (!obj) return '';
        return obj[`id${prefijo}`] || obj.id || '';
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [eqData, usrData] = await Promise.all([
                    equipoService.getAll(),
                    usuarioService.getAll() 
                ]);
                
                setEquipos(eqData || []);
                setTecnicosYSupervisores(usrData || []);

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
                        idEquipo: getId(data, 'Equipo') || data.idEquipo || '',
                        idSupervisor: getId(data, 'Supervisor') || data.idSupervisor || '',
                        tareas: data.tareas || [] // Cargar tareas existentes si las hay
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

    // Manejo de cambios en el formulario principal de Orden
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Agregar tarea a la lista temporal
    const handleAddTareaALista = () => {
        if (!nuevaTarea.descripcion || !nuevaTarea.tecnicoId) {
            alert("Por favor, ingrese la descripción de la tarea y asigne un técnico.");
            return;
        }

        const tecnicoObj = tecnicosYSupervisores.find(t => getId(t, 'Usuario').toString() === nuevaTarea.tecnicoId.toString());
        
        const tareaCompleta = { 
            ...nuevaTarea, 
            tecnicoNombre: tecnicoObj ? (tecnicoObj.username || tecnicoObj.nombre) : 'Técnico',
            // Aseguramos que los IDs sean números para el DTO
            tecnicoId: parseInt(nuevaTarea.tecnicoId)
        };

        setFormData({ 
            ...formData, 
            tareas: [...formData.tareas, tareaCompleta] 
        });

        // Limpiar el form de tarea rápida, pero mantener la fecha
        setNuevaTarea({ 
            ...nuevaTarea, 
            descripcion: '',
            tecnicoId: ''
        }); 
    };

    // Eliminar tarea de la lista temporal
    const handleRemoveTarea = (index) => {
        const updatedTareas = formData.tareas.filter((_, i) => i !== index);
        setFormData({ ...formData, tareas: updatedTareas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de negocio: La orden DEBE tener tareas
        if (formData.tareas.length === 0) {
            alert("Flujo de negocio requerido: No se puede crear o guardar una orden sin al menos una tarea técnica asignada.");
            return;
        }

        setSaving(true);

        const equipoSeleccionado = equipos.find(eq => getId(eq, 'Equipo').toString() === formData.idEquipo.toString());
        const supervisorSeleccionado = tecnicosYSupervisores.find(sup => getId(sup, 'Usuario').toString() === formData.idSupervisor.toString());

        // El Payload debe ser PLANO y contener la lista de tareas
        const payload = {
            idOrden: isEditMode ? parseInt(id) : null,
            tipo: formData.tipo,
            prioridad: formData.prioridad,
            estado: formData.estado,
            descripcion: formData.descripcion,
            fechaCreacion: formData.fechaCreacion ? new Date(formData.fechaCreacion).toISOString() : null,
            fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : null,
            fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : null,
            
            idEquipo: formData.idEquipo === '' ? null : parseInt(formData.idEquipo),
            equipoNombre: equipoSeleccionado ? equipoSeleccionado.nombre : 'Por Defecto',
            
            idSupervisor: formData.idSupervisor === '' ? null : parseInt(formData.idSupervisor),
            supervisorNombre: supervisorSeleccionado ? (supervisorSeleccionado.username || supervisorSeleccionado.nombre) : 'Por Defecto',

            // Lista de TareaDTOs anidadas
            tareas: formData.tareas 
        };

        try {
            if (isEditMode) {
                await ordenService.update(id, payload);
            } else {
                await ordenService.create(payload);
            }
            navigate('/ordenes'); 
        } catch (err) {
            console.error("Error en servidor:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Verifique los campos.";
            alert(`Error al guardar la orden: ${errorMsg}`);
            setSaving(false);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
            
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, boxShadow: 1 }} variant="rounded">
                    <ConfirmationNumber fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800" color="text.primary">
                        {isEditMode ? 'Modificar Orden de Mantenimiento' : 'Crear Orden de Mantenimiento'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Complete los datos y asigne las tareas para generar la solicitud de trabajo.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, bgcolor: '#FFFFFF' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    
                    {/* --- SECCIÓN 1: DETALLES GENERALES --- */}
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        DETALLES GENERALES
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth select label="Tipo de Mantenimiento" name="tipo" value={formData.tipo} onChange={handleChange} required>
                                <MenuItem value="Preventivo">Preventivo</MenuItem>
                                <MenuItem value="Correctivo">Correctivo</MenuItem>
                                <MenuItem value="Predictivo">Predictivo</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth select label="Prioridad" name="prioridad" value={formData.prioridad} onChange={handleChange} required>
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth select label="Estado de la Orden" name="estado" value={formData.estado} onChange={handleChange} required>
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="EnProgreso">En Progreso</MenuItem>
                                <MenuItem value="Completada">Completada</MenuItem>
                                <MenuItem value="Cancelada">Cancelada</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={3} label="Descripción del Problema / Trabajo General" name="descripcion" value={formData.descripcion} onChange={handleChange} required placeholder="Describa el motivo general de la orden..."/>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* --- SECCIÓN 2: ASIGNACIONES Y CRONOGRAMA --- */}
                    <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>
                        ASIGNACIONES Y CRONOGRAMA
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth select label="Equipo Objetivo" name="idEquipo" value={formData.idEquipo} onChange={handleChange} required>
                                <MenuItem value=""><em>-- Seleccione un Equipo --</em></MenuItem>
                                {equipos.map(eq => (
                                    <MenuItem key={getId(eq, 'Equipo')} value={getId(eq, 'Equipo')}>
                                        {eq.nombre} - {eq.codigo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth select label="Supervisor Asignado" name="idSupervisor" value={formData.idSupervisor} onChange={handleChange}>
                                <MenuItem value=""><em>-- Sin Asignar --</em></MenuItem>
                                {tecnicosYSupervisores.map(usr => (
                                    <MenuItem key={getId(usr, 'Usuario')} value={getId(usr, 'Usuario')}>
                                        {usr.username || usr.nombre} ({usr.rol})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth type="date" label="Fecha de Creación" name="fechaCreacion" value={formData.fechaCreacion} onChange={handleChange} required InputLabelProps={{ shrink: true }}/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth type="date" label="Fecha de Inicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth type="date" label="Fecha de Fin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} InputLabelProps={{ shrink: true }}/>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* --- SECCIÓN 3: PLANIFICACIÓN DE TAREAS (NUEVO FLUJO) --- */}
                    <Typography variant="overline" color="primary.main" fontWeight="800" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                        <Build fontSize="small" sx={{ mr: 1 }} />
                        PLANIFICACIÓN DE TAREAS TÉCNICAS
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Una orden debe contener al menos una tarea específica a realizar.
                    </Typography>
                    
                    {/* Input rápido para agregar tareas */}
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField 
                                    fullWidth label="Descripción de la Tarea" 
                                    value={nuevaTarea.descripcion} 
                                    onChange={(e) => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField 
                                    fullWidth select label="Técnico Ejecutor" 
                                    value={nuevaTarea.tecnicoId} 
                                    onChange={(e) => setNuevaTarea({...nuevaTarea, tecnicoId: e.target.value})} 
                                >
                                    {tecnicosYSupervisores.map(t => (
                                        <MenuItem key={getId(t, 'Usuario')} value={getId(t, 'Usuario')}>
                                            {t.username || t.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField 
                                    fullWidth select label="Tipo" 
                                    value={nuevaTarea.tipo} 
                                    onChange={(e) => setNuevaTarea({...nuevaTarea, tipo: e.target.value})} 
                                >
                                    <MenuItem value="Preventivo">Prev.</MenuItem>
                                    <MenuItem value="Correctivo">Corr.</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button 
                                    fullWidth variant="outlined" color="primary" 
                                    startIcon={<Add />} onClick={handleAddTareaALista}
                                    sx={{ height: '56px', fontWeight: 'bold' }}
                                >
                                    Añadir
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Lista de Tareas Agregadas */}
                    {formData.tareas.length > 0 ? (
                        <List sx={{ bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            {formData.tareas.map((t, index) => (
                                <ListItem key={index} divider={index !== formData.tareas.length - 1}>
                                    <ListItemText 
                                        primary={<Typography fontWeight="600">{t.descripcion}</Typography>} 
                                        secondary={`Técnico: ${t.tecnicoNombre} | Tipo: ${t.tipo} | Estado: ${t.estado}`} 
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" color="error" onClick={() => handleRemoveTarea(index)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light', color: 'error.dark', borderRadius: 2 }}>
                            <Typography variant="body2" fontWeight="bold">Debe agregar al menos una tarea a la lista antes de guardar.</Typography>
                        </Box>
                    )}

                    {/* Botones de Acción Globales */}
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
                            disabled={saving || formData.tareas.length === 0}
                            sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                        >
                            {saving ? 'Guardando...' : 'Guardar Orden con Tareas'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}