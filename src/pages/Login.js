import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await authService.login(username, password);
            // Si el login es exitoso, redirigir al panel (crearemos esto luego)
            alert("¡Login Exitoso! Conexión con Backend confirmada.");    
        } catch (err) {
            // Si falla (401 Unauthorized o servidor apagado)
            setError('Credenciales inválidas o error de conexión con el servidor.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <Paper elevation={3} style={{ padding: '30px', width: '100%' }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        SIGEMI
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                        Sistema de Gestión
                    </Typography>

                    {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Usuario"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '20px', padding: '10px' }}
                        >
                            Ingresar
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;