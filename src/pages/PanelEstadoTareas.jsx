import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Grid, TextField, MenuItem, Button, 
    Divider, CircularProgress, Breadcrumbs, Link, Avatar, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton
} from '@mui/material';
import { Save, ArrowBack, Build, Timer, ShoppingCart, Delete, NoteAdd } from '@mui/icons-material';
import tareaService from '../services/tareaService';

export default function PanelEjecucionTarea() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Datos maestros de repuestos simulados por ahora
    const repuestosDisponibles = [
        { id: 101, nombre: 'Rodamiento SKF 6204', stock: 15 },
        { id: 102, nombre: 'Grasa de Litio Alta Temp x 1kg', stock: 5 },
        { id: 103, nombre: 'Correa Dentada Industrial V-Belt', stock: 8 },
        { id: 104, nombre: 'Filtro Hidráulico Parker', stock: 12 }
    ];

    const [tareaData, setTareaData] = useState({
        estado: 'Pendiente',
        tiempoInvertidoHoras: '',
        descripcion: '',
        ordenId: '',
        ordenCodigo: '',
        tecnicoId: '',
        tecnicoNombre: '',
        tipo: 'Preventivo',
        fechaEjecucion: ''
    });

    // Estados para la carga rápida de repuestos consumidos en caliente
    const [repuestosConsumidos, setRepuestosConsumidos] = useState([]);
    const [idRepuestoSeleccionado, setIdRepuestoSeleccionado] = useState('');
    const [cantidadRepuesto, setCantidadRepuesto] = useState('');

    useEffect(() => {
        const cargarDetalleTarea = async () => {
            try {
                console.log("Cargando detalles de la tarea operativa con ID:", id);
                const data = await tareaService.getById(id);
                setTareaData({
                    ...data,
                    tiempoInvertidoHoras: data.tiempoInvertidoHoras ?? '',
                    estado: data.estado || 'Pendiente'
                });
            } catch (error) {
                console.error("Error al obtener la tarea operativa:", error);
                navigate('/tecnico/tareas');
            } finally {
                setLoading(false);
            }
        };
        cargarDetalleTarea();
    }, [id, navigate]);

    const handleAddRepuesto = () => {
        if (!idRepuestoSeleccionado || !cantidadRepuesto) return;
        const repMaster = repuestosDisponibles.find(r => r.id === parseInt(idRepuestoSeleccionado));
        
        const nuevoConsumo = {
            idRepuesto: repMaster.id,
            nombre: repMaster.nombre,
            cantidad: parseInt(cantidadRepuesto)
        };

        setRepuestosConsumidos([...repuestosConsumidos, nuevoConsumo]);
        setIdRepuestoSeleccionado('');
        setCantidadRepuesto('');
    };

    const handleRemoveRepuesto = (index) => {
        setRepuestosConsumidos(repuestosConsumidos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...tareaData,
            tiempoInvertidoHoras: tareaData.tiempoInvertidoHoras === '' ? null : parseFloat(tareaData.tiempoInvertidoHoras),
            // Adjuntamos los repuestos utilizados en el formato transaccional UsoRepuesto 
            repuestosUtilizados: repuestosConsumidos
        };

        try {
            console.log("Payload a enviar para actualización de tarea:", payload);
            await tareaService.update(id, payload);
            alert("Parte de trabajo guardado correctamente.");
            navigate('/tecnico/tareas');
        } catch (error) {
            console.error("Error al persistir el avance técnico:", error);
            alert("No se pudo guardar el avance técnico. Verifique la conexión.");
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate('/tecnico/tareas')} sx={{ cursor: 'pointer' }}>
                    Mis Tareas
                </Link>
                <Typography color="text.primary" fontWeight="bold">Ejecución Tarea #{id}</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }} variant="rounded">
                    <Build fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="800">Parte Diario de Trabajo</Typography>
                    <Typography variant="body1" color="text.secondary">Orden Vinculada: #{tareaData.ordenCodigo || tareaData.ordenId}</Typography>
                </Box>
            </Box>

            <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
                {/* Panel de Información de la Actividad */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, bgcolor: '#FFFFFF', mb: 3 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700">Especificación de Tarea</Typography>
                        <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 2, minHeight: 100 }}>
                            <Typography variant="body1" fontWeight="500">{tareaData.descripcion}</Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ mb: 2, display: 'block' }}>Reporte de Progreso y Tiempos</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth select label="Estado de Ejecución" name="estado"
                                    value={tareaData.estado} 
                                    onChange={(e) => setTareaData({...tareaData, estado: e.target.value})}
                                >
                                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                                    <MenuItem value="EnProgreso">En Progreso (Iniciar)</MenuItem>
                                    <MenuItem value="Completada">Completada (Finalizar)</MenuItem>
                                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth type="number" label="Tiempo Invertido (Horas)" name="tiempoInvertidoHoras"
                                    value={tareaData.tiempoInvertidoHoras} inputProps={{ step: "0.5", min: "0" }}
                                    onChange={(e) => setTareaData({...tareaData, tiempoInvertidoHoras: e.target.value})}
                                    InputProps={{ startAdornment: <Timer fontSize="small" sx={{ color: 'text.disabled', mr: 1 }} /> }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Notas / Observaciones de Cierre */}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, bgcolor: '#FFFFFF' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NoteAdd fontSize="small"/> Observaciones de Resolución
                        </Typography>
                        <TextField 
                            fullWidth multiline rows={4} sx={{ mt: 2 }}
                            placeholder="Describa los hallazgos técnicos o comentarios sobre la reparación efectuada..."
                        />
                    </Paper>
                </Grid>

                {/* Sub-panel de Pañol y Repuestos */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, bgcolor: '#FFFFFF', height: '100%' }}>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShoppingCart fontSize="small" /> Consumo de Repuestos (Pañol)
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Impute los materiales retirados del almacén.</Typography>
                        
                        <Grid container spacing={1.5} sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth select label="Seleccionar Repuesto"
                                    value={idRepuestoSeleccionado} onChange={(e) => setIdRepuestoSeleccionado(e.target.value)}
                                >
                                    {repuestosDisponibles.map(r => (
                                        <MenuItem key={r.id} value={r.id}>{r.nombre} (Stock: {r.stock})</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth type="number" label="Cantidad Usada"
                                    value={cantidadRepuesto} onChange={(e) => setCantidadRepuesto(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button 
                                    fullWidth variant="outlined" color="primary" 
                                    onClick={handleAddRepuesto} sx={{ height: '56px', fontWeight: 'bold', borderRadius: 2 }}
                                >
                                    Añadir
                                </Button>
                            </Grid>
                        </Grid>

                        <Divider />

                        <List dense sx={{ mt: 1 }}>
                            {repuestosConsumidos.length === 0 ? (
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', p: 2, textAlign: 'center' }}>
                                    Ningún material imputado a este parte.
                                </Typography>
                            ) : repuestosConsumidos.map((item, index) => (
                                <ListItem key={index} divider sx={{ px: 0 }}>
                                    <ListItemText primary={item.nombre} secondary={`Cantidad: ${item.cantidad} unidades`} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" color="error" size="small" onClick={() => handleRemoveRepuesto(index)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Acciones del Formulario */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/tecnico/tareas')} startIcon={<ArrowBack />} disabled={saving}>
                            Volver
                        </Button>
                        <Button type="submit" variant="contained" color="primary" startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />} disabled={saving}>
                            {saving ? 'Guardando Parte...' : 'Registrar Parte de Trabajo'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}