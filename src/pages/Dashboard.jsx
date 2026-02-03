import React from 'react';
import { 
    Grid, Paper, Typography, Box, Chip, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, LinearProgress, Avatar 
} from '@mui/material';
import { 
    WarningAmber, CheckCircleOutline, BuildCircle, AccessTime 
} from '@mui/icons-material';

// --- COMPONENTE DE TARJETA KPI ---
const StatCard = ({ title, value, subtitle, icon, color, bgColor }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }
        }}
    >
        <Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="600" textTransform="uppercase">
                {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ my: 1, color: 'text.primary' }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime fontSize="small" sx={{ color: color, opacity: 0.8 }} /> {subtitle}
            </Typography>
        </Box>
        <Avatar
            variant="rounded"
            sx={{
                bgcolor: bgColor,
                color: color,
                width: 56,
                height: 56,
                borderRadius: 2
            }}
        >
            {icon}
        </Avatar>
    </Paper>
);

const ORDERS = [
    { id: 'WO-2023-001', equipo: 'Torno CNC Mazak', tipo: 'Correctivo', estado: 'Abierta', prioridad: 'Alta', progreso: 10 },
    { id: 'WO-2023-002', equipo: 'Compresor Aire #2', tipo: 'Preventivo', estado: 'En Proceso', prioridad: 'Media', progreso: 45 },
    { id: 'WO-2023-003', equipo: 'Cinta Transportadora', tipo: 'Predictivo', estado: 'Finalizada', prioridad: 'Baja', progreso: 100 },
    { id: 'WO-2023-004', equipo: 'Bomba Hidráulica P-10', tipo: 'Correctivo', estado: 'Pendiente', prioridad: 'Crítica', progreso: 0 },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Panel de Control
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Visión general del estado de mantenimiento de planta.
                </Typography>
            </Box>

            {/* CORRECCIÓN 2: Sintaxis de Grid v1 (container -> item) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Alertas Críticas" 
                        value="3" 
                        subtitle="REQUIEREN ATENCIÓN"
                        icon={<WarningAmber fontSize="medium" />} 
                        color="#D32F2F" 
                        bgColor="#FFEBEE"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Equipos Operativos" 
                        value="94%" 
                        subtitle="OBJETIVO: 96%"
                        icon={<CheckCircleOutline fontSize="medium" />} 
                        color="#2E7D32" 
                        bgColor="#E8F5E9"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Órdenes Activas" 
                        value="12" 
                        subtitle="5 ASIGNADAS A TI"
                        icon={<BuildCircle fontSize="medium" />} 
                        color="#1565C0" 
                        bgColor="#E3F2FD"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Tiempo Promedio Rep." 
                        value="4.2h" 
                        subtitle="-15% VS MES PASADO"
                        icon={<AccessTime fontSize="medium" />} 
                        color="#ED6C02" 
                        bgColor="#FFF3E0"
                    />
                </Grid>
            </Grid>

            {/* SECCIÓN TABLA DETALLADA */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Órdenes de Trabajo Recientes
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: '#F5F5F5' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">CÓDIGO</TableCell>
                            <TableCell fontWeight="bold">EQUIPO</TableCell>
                            <TableCell fontWeight="bold">TIPO</TableCell>
                            <TableCell fontWeight="bold">PRIORIDAD</TableCell>
                            <TableCell fontWeight="bold">ESTADO</TableCell>
                            <TableCell fontWeight="bold" align="center">ACCIONES</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ORDERS.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main' }}>
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.equipo}</TableCell>
                                <TableCell>{row.tipo}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.prioridad} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 600,
                                            borderRadius: 1,
                                            bgcolor: row.prioridad === 'Crítica' ? '#FFEBEE' : row.prioridad === 'Alta' ? '#FFF3E0' : '#E8F5E9',
                                            color: row.prioridad === 'Crítica' ? '#D32F2F' : row.prioridad === 'Alta' ? '#ED6C02' : '#2E7D32',
                                            border: '1px solid',
                                            borderColor: 'currentColor'
                                        }} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">
                                        {row.estado}
                                    </Typography>
                                </TableCell>
                                {/* BOTON DE ACCION */}
                                <TableCell align="center">
                                    <Tooltip title="Ver Detalles de Orden">
                                        <IconButton 
                                            color="primary" 
                                            size="small"
                                            onClick={() => navigate(`/ordenes/${row.id}`)} // Navegación a detalle
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}