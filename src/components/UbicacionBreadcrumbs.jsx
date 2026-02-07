import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';

export default function UbicacionBreadcrumbs({ path, onNavigate }) {
    return (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                {/* Nodo Raíz */}
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 500 }}
                    color="inherit"
                    onClick={() => onNavigate(null)}
                >
                    <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </Link>
                
                {/* Nodos Intermedios */}
                {path.slice(0, -1).map((item) => (
                    <Link
                        key={item.id}
                        underline="hover"
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
                        color="inherit"
                        onClick={() => onNavigate(item.id)}
                    >
                        {item.nombre}
                    </Link>
                ))}
                
                {/* Nodo Actual  */}
                {path.length > 0 && (
                    <Typography color="text.primary" fontWeight={700}>
                        {path[path.length - 1].nombre}
                    </Typography>
                )}
            </Breadcrumbs>
        </Box>
    );
}