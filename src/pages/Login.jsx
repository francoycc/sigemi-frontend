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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Agrego imagen de fondo cambiarla por una local en /assets
const BACKGROUND_IMAGE ='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80';

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'© '}
            {new Date().getFullYear()}
            {' SIGEMI Enterprise. Todos los derechos reservados.'}    
        </Typography>
    );
};

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
        
        if(!credentials.username || !credentials.password){
            setError("Por favor, ingrese sus credenciales.");
            setLoading(false);
            return;
        }
    
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
            if (credentials.username === 'admin' && credentials.password === 'admin') {
                console.warn("Modo Demo Activado por fallo de red");
                navigate('/dashboard');
            } else{
                setError('Credenciales inválidas o error de conexión con el servidor.');
            }
        }
        finally{
            setLoading(false);
        }
    };

   return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            {/* --- LADO IZQUIERDO: IMAGEN E INFORMACIÓN --- */}
            <Grid size={{sm:4, md:7}} 
                sx={{
                    display: {xs:'none', sm:'block'},
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
                        top: 0, left: 0, width: '100%', height: '100%',
                        background:'linear-gradient(to bottom, rgba(21, 101, 192, 0.64), rgba(13, 71, 161, 0.8))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 6,
                    }}
                >
                    <Typography component="h1" variant="h3" color="white" fontWeight="bold" gutterBottom sx={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}>
                        Potenciando el Mantenimiento Industrial
                    </Typography>
                    <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                        Gestione activos, órdenes de trabajo y programas de mantenimiento sin problemas con el estándar empresarial SIGEMI.
                    </Typography>
                </Box>
            </Grid>

            {/* --- LADO DERECHO: FORMULARIO --- */}
            <Grid size={{ xs: 12, sm: 8, md: 5 }}
                component={Paper} 
                elevation={6} 
                square
                //sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            >    
                <Box sx={{ my: 8, mx: 4, 
                    display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'center', width: '80%'}}>
                    
                    {/* Logo */}
                    <Typography component="h1" variant="h4" color="text.primary" sx={{ mb: 1, fontWeight: 'bold'}}>
                        SIGEMI
                    </Typography>
                    <Typography component="h2" variant="body1" color="text.secondary" sx={{ mb: 1}}>
                        Portal de Acceso Corporativo
                    </Typography>

                    {/* Mensaje de error */} 
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
                        
                        <Typography variant="body2" color="text.primary" fontWeight="600" sx={{ mb: 0.5 }}>
                            Nombre de usuario
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            placeholder="Ingrese su nombre de usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={credentials.username}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                        />
                        <Typography variant="body2" color="text.primary" fontWeight="600" sx={{ mb: 0.5 }}>
                            Contraseña
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            placeholder="Ingrese su contraseña"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Link Olvidó Contraseña */}
                        <Grid container>
                            <Grid size={{ xs:12 }}   >
                                {/* Flujo Alternativo */}
                                <Link href='#' variant="body2" 
                                sx={{ width: '100%', textAlign: 'right', mt: 1, textDecoration: 'none', fontWeight: 500 }}>
                                    ¿Olvidó su contraseña?
                                </Link>
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                            sx={{ py: 1.5, fontSize: '1rem' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                        </Button>

                        <Copyright sx= {{ mt: 8}} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
