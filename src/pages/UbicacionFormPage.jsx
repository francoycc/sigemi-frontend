import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Avatar, Divider, CircularProgress
} from '@mui/material';
import { Save, ArrowBack, EditLocationAlt, AddLocationAlt } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

export default function UbicacionFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Estados de UI
    const [loading, setLoading] = useState(isEditMode); // Carga inicial solo si es edición
    const [saving, setSaving] = useState(false);        // Carga al guardar

    // Estados de datos
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
                // 1. Cargar todas las ubicaciones para el select de "Padre"
                const allUbicaciones = await ubicacionService.getAll();
                setUbicacionesDisponibles(allUbicaciones);

                // 2. Si es edición, obtener los datos de esta ubicación
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
                alert("No se pudo cargar la información requerida de la BD.");
                navigate('/ubicaciones');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, navigate]);

    // Manejador genérico para Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador del Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Transformamos el string vacío a null para el backend
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
            navigate('/ubicaciones'); // Regresar a la tabla si el backend responde 2xx
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error al conectar con la base de datos.";
            alert(`Error al guardar: ${errorMsg}`);
            setSaving(false);
        }
    };

    // Pantalla de carga mientras se obtienen los datos (ideal para Editar)
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 850, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            
            {/* Header Alineado con el estilo del Dashboard / Ubicaciones */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 48, height: 48 }} variant="rounded">
                    {isEditMode ? <EditLocationAlt /> : <AddLocationAlt />}
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {isEditMode ? 'Editar Ubicación Técnica' : 'Nueva Ubicación Técnica'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {isEditMode 
                            ? 'Modifique los atributos del nodo seleccionado.' 
                            : 'Complete los datos para registrar un nuevo nodo en la estructura.'}
                    </Typography>
                </Box>
            </Box>

            {/* Contenedor principal estilo "Card Outlined" */}
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        
                        {/* Fila 1 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Código Técnico"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                                helperText={isEditMode ? "El código es un identificador único inmutable." : "Ej. PLANTA-01, SECTOR-A"}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Estado Operativo"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Operativo">Operativo</MenuItem>
                                <MenuItem value="EnReparacion">En Reparación</MenuItem>
                                <MenuItem value="FueraDeServicio">Fuera de Servicio</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Fila 2 */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de la Ubicación"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Línea de Ensamblaje Principal"
                            />
                        </Grid>

                        {/* Fila 3 */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tipo de Ubicación"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Edificio, Sector, Máquina..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Ubicación Padre (Superior)"
                                name="idPadre"
                                value={formData.idPadre}
                                onChange={handleChange}
                                helperText="Deje en blanco si es un nodo raíz."
                            >
                                <MenuItem value="">
                                    <em>-- Ninguna (Nodo Raíz) --</em>
                                </MenuItem>
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

                    <Divider sx={{ mt: 4, mb: 3 }} />

                    {/* Botones de acción alineados a la derecha */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            onClick={() => navigate('/ubicaciones')}
                            startIcon={<ArrowBack />}
                            disabled={saving}
                            sx={{ color: 'text.secondary', borderColor: 'divider' }}
                        >
                            Volver
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            disabled={saving}
                            sx={{ px: 4, borderRadius: 2 }}
                        >
                            {saving ? 'Guardando...' : 'Guardar Ubicación'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}