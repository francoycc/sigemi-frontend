import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, TextField, MenuItem, Grid, Divider 
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

export default function UbicacionFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Estado para el formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: '',
        estado: 'Operativo',
        idPadre: ''
    });

    const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);

    useEffect(() => {
        // Cargar todas las ubicaciones para el select de Padre
        ubicacionService.getAll()
            .then(data => setUbicacionesDisponibles(data))
            .catch(err => console.error("Error al cargar ubicaciones disponibles:", err));

        // Si es edición, cargar datos
        if (isEditMode) {
            ubicacionService.getById(id)
                .then(data => {
                    setFormData({
                        codigo: data.codigo || '',
                        nombre: data.nombre || '',
                        tipo: data.tipo || '',
                        estado: data.estado || 'Operativo',
                        idPadre: data.idPadre || ''
                    });
                })
                .catch(err => {
                    console.error("Error al obtener la ubicación:", err);
                    alert("No se pudo cargar la información de la ubicación.");
                    navigate('/ubicaciones');
                });
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            navigate('/ubicaciones'); // Volver al listado
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error desconocido al guardar";
            alert(`Error al guardar: ${errorMsg}`);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
                    {isEditMode ? 'Editar Ubicación Técnica' : 'Nueva Ubicación Técnica'}
                </Typography>
                <Divider sx={{ mb: 4 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        
                        {/* Fila 1: Código y Estado */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Código"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                required
                                disabled={isEditMode}
                                helperText={isEditMode ? "El código no se puede modificar" : "Ej. PLANTA-01"}
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

                        {/* Fila 2: Nombre */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de la Ubicación"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Línea de Producción A"
                            />
                        </Grid>

                        {/* Fila 3: Tipo y Padre */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Edificio, Sector, Máquina"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Ubicación Padre (Opcional)"
                                name="idPadre"
                                value={formData.idPadre}
                                onChange={handleChange}
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

                        {/* Botones de Acción */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                onClick={() => navigate('/ubicaciones')}
                                startIcon={<Cancel />}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                startIcon={<Save />}
                                sx={{ px: 4 }}
                            >
                                Guardar
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}