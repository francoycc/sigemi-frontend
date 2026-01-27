import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Link, 
    Grid, 
    Box, 
    Typography, 
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Agrego imagen de fondo cambiarla por una local en /assets
const BACKGROUND_IMAGE ='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80';

export default function Login() {
    const navigate = useNavigate();

    // Estados para el formulario
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        if(error) setError('');
    }

    // Manejo del submit del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            // Llamada al service de auth
            await authService.login(credentials.username, credentials.password);
            
            // Si el login es exitoso, redirigir al panel (crearemos esto luego)
            console.log("Enviando credenciales:", credentials);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula retardo de red
            
            // redirigir al dashboard
            navigate('/dashboard');
            alert("¡Login Exitoso! Conexión con Backend confirmada.");    
        } catch (err) {
            // Si falla 
            setError('Credenciales inválidas o error de conexión con el servidor.');
        }
        finally{
            setLoading(false);
        }
    };

   return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            {/* --- LADO IZQUIERDO: IMAGEN E INFORMACIÓN --- */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${BACKGROUND_IMAGE})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                {/* Capa oscura sobre la imagen para leer el texto */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(21, 101, 192, 0.6)', // Azul corporativo transparente
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 8,
                    }}
                >
                    <Typography component="h1" variant="h3" color="white" fontWeight="bold" gutterBottom>
                        Potenciando el Mantenimiento Industrial
                    </Typography>
                    <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                        Gestione activos, órdenes de trabajo y programas de mantenimiento sin problemas con el estándar empresarial SIGEMI.
                    </Typography>
                </Box>
            </Grid>

            {/* --- LADO DERECHO: FORMULARIO --- */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80%'
                    }}
                >
                    {/* Logo o Título */}
                    <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
                        SIGEMI
                    </Typography>
                    <Typography component="h2" variant="subtitle1" color="text.secondary" gutterBottom>
                        Portal de Acceso Corporativo
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4, width: '100%', maxWidth: '400px' }}>
                        
                        {/* Mensaje de Error */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nombre de Usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={credentials.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="cambiar visibilidad contraseña"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Link Olvidó Contraseña */}
                        <Grid container>
                            <Grid item xs>
                                {/* Flujo Alternativo */}
                                <Link 
                                    component="button"
                                    type="button"
                                    variant="body2" 
                                    onClick={() => navigate('/recuperar-password')}
                                >
                                    ¿Olvidó su contraseña?
                                </Link>
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            startIcon={!loading && <LoginIcon />}
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                        </Button>

                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
                            © {new Date().getFullYear()} SIGEMI Enterprise. Todos los derechos reservados.
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
