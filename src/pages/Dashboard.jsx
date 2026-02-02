import React from 'react';
import { 
    Grid, Paper, Typography, Box, Chip, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Avatar 
} from '@mui/material';
import { 
    WarningAmber, CheckCircleOutline, BuildCircle, TrendingUp 
} from '@mui/icons-material';

// --- COMPONENTE DE TARJETA KPI (Estilo Industrial) ---
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
                <TrendingUp fontSize="small" color="success" /> {subtitle}
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

// Datos simulados para la tabla
const RECENT_ORDERS = [
    { id: 'WO-001', equipo: 'Torno CNC Haas', prioridad: 'Alta', estado: 'Abierta', fecha: '2023-10-25' },
    { id: 'WO-002', equipo: 'Compresor Atlas', prioridad: 'Media', estado: 'En Proceso', fecha: '2023-10-24' },
    { id: 'WO-003', equipo: 'Bomba Hidráulica', prioridad: 'Baja', estado: 'Finalizada', fecha: '2023-10-23' },
];

export default function Dashboard() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido, Supervisor
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Aquí tienes el resumen del estado de planta hoy.
                </Typography>
            </Box>

            {/* --- SECCIÓN KPI --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                
                {/* KPI 1: Críticos */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Alertas Críticas" 
                        value="3" 
                        subtitle="2 nuevas hoy"
                        icon={<WarningAmber fontSize="large" />} 
                        color="#d32f2f" // Rojo fuerte
                        bgColor="#ffebee" // Rojo muy suave
                    />
                </Grid>

                {/* KPI 2: Operativos */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Equipos Operativos" 
                        value="94%" 
                        subtitle="+1.2% vs semana anterior"
                        icon={<CheckCircleOutline fontSize="large" />} 
                        color="#2e7d32" // Verde fuerte
                        bgColor="#e8f5e9" // Verde suave
                    />
                </Grid>

                {/* KPI 3: Órdenes */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Órdenes Activas" 
                        value="12" 
                        subtitle="5 asignadas a ti"
                        icon={<BuildCircle fontSize="large" />} 
                        color="#1565C0" // Azul corporativo
                        bgColor="#e3f2fd" // Azul suave
                    />
                </Grid>

                {/* KPI 4: Preventivos */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard 
                        title="Preventivos (Mes)" 
                        value="28" 
                        subtitle="8 pendientes"
                        icon={<TrendingUp fontSize="large" />} 
                        color="#ed6c02" // Naranja
                        bgColor="#fff3e0" // Naranja suave
                    />
                </Grid>
            </Grid>

            {/* --- SECCIÓN TABLA --- */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Órdenes Recientes
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: '#F4F6F8' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">Código</TableCell>
                            <TableCell>Equipo</TableCell>
                            <TableCell>Prioridad</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {RECENT_ORDERS.map((row) => (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.equipo}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.prioridad} 
                                        size="small" 
                                        color={row.prioridad === 'Alta' ? 'error' : row.prioridad === 'Media' ? 'warning' : 'success'} 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.estado} 
                                        size="small" 
                                        color={row.estado === 'Abierta' ? 'primary' : 'default'} 
                                        sx={{ fontWeight: 500 }}
                                    />
                                </TableCell>
                                <TableCell align="right">{row.fecha}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}