import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, MenuItem, Grid 
} from '@mui/material';

const TIPOS_UBICACION = ['Planta', 'Sector', 'Línea', 'Área'];
const ESTADOS_UBICACION = ['Operativo', 'EnReparacion', 'FueraDeServicio'];

export default function UbicacionForm({ open, onClose, onSubmit, initialData, idPadre}) {
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: 'Sector',
        estado: 'Operativo',
        idPadre: idPadre || null
    });

    useEffect(() => {
        console.log("Inicializando formulario con datos:", initialData, "y idPadre:", idPadre);
        if(initialData){
            setFormData({
                ...initialData,
                idPadre: initialData.idPadre || null
            });
        } else {
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
    console.log("Campo modificado:", e.target.name, "Valor:", e.target.value);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));
};

const handleSubmit = (e) => {
    console.log("Enviando formulario con datos:", formData);
    e.preventDefault();
    onSubmit(formData);
};

return(
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            {initialData ? 'Modificar Ubicación' : 'Nueva Ubicación Técnica'}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Código" name="codigo" value={formData.codigo}
                        onChange={handleChange}
                        fullWidth
                        required
                        disabled={!!initialData} // No se permiten cambios
                        helperText={initialData ? "Ej: SEC-MEC-01. El código no se puede modificar" : "Ingrese un código único"}
                        />    
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Nombre" name="nombre" value={formData.nombre}
                        onChange={handleChange} 
                        fullWidth
                        required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField select label="Tipo" name="tipo" value={formData.tipo}
                        onChange={handleChange} 
                        fullWidth
                        required
                        >
                            {TIPOS_UBICACION.map((tipo) => (
                                <MenuItem key={tipo} value={tipo}>
                                    {tipo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                            <TextField select label="Estado Operativo" name="estado" value={formData.estado}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {ESTADOS_UBICACION.map((estado) => (
                                    <MenuItem key={estado} value={estado}>
                                        {estado}
                                    </MenuItem>
                                ))}
                            </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                    {initialData ? 'Guardar Cambios' : 'Crear Ubicación'}
                </Button>
            </DialogActions>
        </form>
    </Dialog>
    );
}