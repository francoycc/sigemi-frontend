import axios from 'axios';

// Definimos la URL base de tu Backend Spring Boot
const API_URL = 'http://localhost:8080/api';

// Creamos una instancia de Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Antes de cada petición, si hay un usuario guardado, agrega su autenticación
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user && user.authHeader) {
            // Agregamos la cabecera Basic Auth: "Authorization: Basic dXN1YXJpbzpjb250cmFzZcOxYQ=="
            config.headers['Authorization'] = user.authHeader;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;