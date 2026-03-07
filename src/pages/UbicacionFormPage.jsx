import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, TextField, MenuItem, Grid, Button, 
    Avatar, Breadcrumbs, Link, Divider, Card, CardContent, CircularProgress,
    List, ListItemButton, Collapse
} from '@mui/material';
import { 
    Settings, Place, PrecisionManufacturing, Business, 
    ViewModule, ExpandLess, ExpandMore, AccountTree, AddCircleOutline 
} from '@mui/icons-material';
import ubicacionService from '../services/ubicacionService';

// --- MOCK DE DATOS DE JERARQUÍA PARA EL WIDGET SELECTOR ---
const HIERARCHY_DATA = {
    id: 'roots',
    nombre: 'Ubicaciones',
    children: [
        {
            id: 1,
            nombre: 'Planta Rosario',
            tipo: 'Planta',
            children: [
                { id: 3, nombre: 'Sector Mecanizado', tipo: 'Sector' },
                { id: 4, nombre: 'Planta Rosario / Fuera de Servicio', tipo: 'Sector' },
            ]
        },
        { id: 2, nombre: 'Planta Santa Fe', tipo: 'Planta' },
        { id: 5, nombre: 'Criticidad Alta (Sin padre)', tipo: 'Planta' }
    ]
};

// --- SUB-COMPONENTE: WIDGET DE ÁRBOL DE JERARQUÍA ---
const HierarchyTreeWidget = ({ data, selectedId, onSelect }) => {
    const [openNodes, setOpenNodes] = useState({ roots: true });

    const handleToggle = (id) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderTreeItem = (item) => {
        const isSelected = selectedId === item.id;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <Box key={item.id} sx={{ pl: item.id === 'roots' ? 0 : 3 }}>
                <ListItemButton 
                    onClick={() => {
                        if (item.id !== 'roots') onSelect(item.id);
                        if (hasChildren) handleToggle(item.id);
                    }}
                    sx={{ 
                        borderRadius: 1, mb: 0.5,
                        pl: item.id === 'roots' ? 1 : 1.5,
                        bgcolor: isSelected ? 'primary.light' : 'transparent',
                        color: isSelected ? 'primary.main' : 'text.primary',
                        fontWeight: isSelected ? 600 : 400
                    }}
                >
                    <Place fontSize="small" sx={{ mr: 1, color: isSelected ? 'inherit' : 'text.secondary' }} />
                    <Typography variant="body2">{item.nombre}</Typography>
                    {hasChildren ? (openNodes[item.id] ? <ExpandLess size={18} /> : <ExpandMore size={18} />) : null}
                </ListItemButton>
                
                {hasChildren && (
                    <Collapse in={openNodes[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map(child => renderTreeItem(child))}
                        </List>
                    </Collapse>
                )}
            </Box>
        );
    };

    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'white', p: 1, maxHeight: 300, overflow: 'auto' }}>
            <List component="nav">{renderTreeItem(HIERARCHY_DATA)}</List>
        </Paper>
    );
};


// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function UbicacionFormPage() {
    const { id } = useParams(); // Si existe ID, es modo edición
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '', nombre: '', tipo: 'Sector', estado: 'Operativo', idPadre: null
    });

    useEffect(() => {
        if (isEditMode) {
            loadInitialData();
        }
    }, [id]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const data = await ubicacionService.getById(id);
            setFormData({ ...data, idPadre: data.idPadre || null });
        } catch (error) {
            console.error("Error cargando datos", error);
            navigate('/ubicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await ubicacionService.update(id, formData);
            } else {
                await ubicacionService.create(formData);
            }
            navigate('/ubicaciones');
        } catch (error) {
            alert(error.response?.data?.message || "Ocurrió un error.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            {/* Cabecera, Breadcrumbs y Título */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1, color: 'text.secondary' }}>
                    <Link underline="hover" color="inherit" href="/dashboard">Inicio</Link>
                    <Link underline="hover" color="inherit" href="/ubicaciones">Ubicaciones</Link>
                    <Typography color="primary">{isEditMode ? 'Editar' : 'Crear'}</Typography>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Settings color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                        {isEditMode ? 'MODIFICAR UBICACIÓN TÉCNICA' : 'NUEVA UBICACIÓN TÉCNICA'}
                    </Typography>
                </Box>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Área Principal del Formulario  */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'white' }}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Código Técnico" name="codigo" required fullWidth
                                        value={formData.codigo} onChange={handleChange} disabled={isEditMode}
                                        helperText="Formato: TNC-ROS-01 (Monospace, Mayúsculas)"
                                        inputProps={{ style: { fontFamily: 'monospace', textTransform: 'uppercase' }}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Nombre de Ubicación" name="nombre" required fullWidth value={formData.nombre} onChange={handleChange} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Tipo de Activo" name="tipo" required fullWidth value={formData.tipo} onChange={handleChange}>
                                        {[ {v: 'Planta', i: <Business/>}, {v: 'Sector', i: <FolderOpen/>}, {v: 'Línea', i: <PrecisionManufacturing/>}].map(op => (
                                            <MenuItem key={op.v} value={op.v}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{op.i} {op.v}</Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Estado Operativo" name="estado" required fullWidth value={formData.estado} onChange={handleChange}>
                                        {[ {v: 'Operativo', i: '✅'}, {v: 'FueraDeServicio', i: '🔧 Fuera de Servicio'}].map(op => (
                                            <MenuItem key={op.v} value={op.v}>{op.i}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                
                                <Divider sx={{ my: 3, gridColumn: 'span 12' }} />
                                
                                {/* WIDGET SELECTOR DE JERARQUÍA */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
                                        Asignación de Padre
                                    </Typography>
                                    <HierarchyTreeWidget 
                                        data={HIERARCHY_DATA} 
                                        selectedId={formData.idPadre} 
                                        onSelect={(id) => setFormData(prev => ({ ...prev, idPadre: id }))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Área Lateral de Resumen */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FAFAFBF' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Ayuda de Creación</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Defina la jerarquía del activo industrial. Use el widget a la izquierda para navegar y seleccionar la carpeta contenedora.
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">ESTADOS:</Typography>
                                <Typography variant="caption" display="block">✅ <b>Operativo:</b> Activo disponible.</Typography>
                                <Typography variant="caption" display="block">🔧 <b>Fuera de Servicio:</b> En mantenimiento o baja.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Pie de página fijo  */}
                <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, right: 0, width: '100%', bgcolor: 'white', p: 2, pl: '280px', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => navigate('/ubicaciones')} disabled={loading}>
                            CANCELAR
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {isEditMode ? 'GUARDAR CAMBIOS' : 'CREAR UBICACIÓN'}
                        </Button>
                    </Box>
                </Paper>
            </form>
        </Box>
    );
}