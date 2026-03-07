import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, MenuItem, Grid, Box, Typography 
} from '@mui/material';
import { BuildCircle } from '@mui/icons-material';

const TIPOS = ['Planta', 'Sector', 'Línea', 'Puesto', 'Máquina'];
const ESTADOS = ['Operativo', 'FueraDeServicio']; 

export default function UbicacionForm({ open, onClose, onSubmit, initialData, idPadre }) {
    console.log('UbicacionForm:', { open, initialData, idPadre });
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: 'Sector',
        estado: 'Operativo',
        idPadre: null
    });

    useEffect(() => {
        if (initialData) {
            console.log('[UbicacionForm] Cargando datos para edición:', initialData);
            setFormData({
                ...initialData,
                idPadre: initialData.idPadre || null 
            });
        } else {
            console.log('[UbicacionForm]Inicializando formulario para nueva ubicación con idPadre:', idPadre);
            setFormData({
                codigo: '',
                nombre: '',
                tipo: idPadre === null ? 'Planta' : 'Sector', 
                estado: 'Operativo',
                idPadre: idPadre 
            });
        }
    }, [initialData, idPadre, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BuildCircle color="primary"/>
                    {initialData ? 'Editar Ubicación Técnica' : 'Nueva Ubicación Técnica'}
                </Box>
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ bgcolor: '#FAFBFD' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, fontWeight: 600 }}>
                        {initialData ? `ID Sistema: ${initialData.idUbicacion}` : `Asignando a Padre ID: ${idPadre || 'Raíz (Principal)'}`}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Código Técnico"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={!!initialData} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre de la Ubicación"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select label="Tipo de Activo" name="tipo" value={formData.tipo} onChange={handleChange} fullWidth required>
                                {TIPOS.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select label="Estado Operativo" name="estado" value={formData.estado} onChange={handleChange} fullWidth required>
                                {ESTADOS.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option === 'Operativo' ? '✅ Operativo' : '🔧 Fuera de Servicio'}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: 'white' }}>
                    <Button onClick={onClose} color="inherit" variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Guardar Cambios' : 'Registrar Ubicación'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}