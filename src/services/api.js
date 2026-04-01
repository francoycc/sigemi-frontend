import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de Peticiones (Request)
api.interceptors.request.use(
    (config) => {
        // Inyección automática de credenciales (Basic Auth actual, preparable para JWT)
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.authdata) {
            config.headers.Authorization = `Basic ${user.authdata}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuestas (Response)
api.interceptors.response.use(
    (response) => {
        // Si devuelve un objeto Pageable, extraemos 'content'
        // Si devuelve un List directo, lo dejamos intacto.
        if (response.data && response.data.content !== undefined) {
            response.data = response.data.content;
        }
        return response;
    },
    (error) => {
        // Manejo centralizado de excepciones HTTP
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                console.error('[API] No autorizado. Sesión expirada o credenciales inválidas.');
                localStorage.removeItem('user');
                window.location.href = '/login'; // Redirección forzada segura
            } else if (status === 403) {
                console.error('[API] Acceso denegado a este recurso.');
            } else if (status === 400) {
                console.warn('[API] Bad Request: Error de validación en DTOs de Spring Boot.', error.response.data);
            } else if (status >= 500) {
                console.error('[API] Error interno del servidor Java.', error.response.data);
            }
        } else if (error.request) {
            console.error('[API] Sin respuesta del servidor. Verificar que Spring Boot esté en ejecución.');
        }
        
        return Promise.reject(error);
    }
);

export default api;