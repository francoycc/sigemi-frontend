import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Interceptor de Peticiones (Request) 
api.interceptors.request.use(
    (config) => {
        // Obtenemos el token directamente
        let token = localStorage.getItem('token');
        
        if (token) {
            // Limpiamos comillas extrañas por las dudas (un bug muy común al migrar)
            token = token.replace(/^"(.*)"$/, '$1'); 
            
            config.headers.Authorization = `Bearer ${token}`;
            console.log("[AXIOS] Token inyectado en petición a:", config.url); // Log de depuración
        } else {
            console.warn("[AXIOS] CUIDADO: Petición enviada SIN token a:", config.url);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Interceptor de Respuestas (Response) 
api.interceptors.response.use(
    (response) => {
        // Si el controlador de Spring Boot devuelve un Pageable, extraemos el 'content' automáticamente
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
                console.error('[API] No autorizado. Sesión expirada o token inválido.');
                
                // Limpieza total del almacenamiento para evitar bucles infinitos
                localStorage.removeItem('user');
                localStorage.removeItem('token'); 
                
                window.location.href = '/login'; 
            } else if (status === 403) {
                console.error('[API] Acceso denegado a este recurso. Verifique los permisos del rol.');
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