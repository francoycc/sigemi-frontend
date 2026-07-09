import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const login = async (username, password) => {
    try {
        // Envía las credenciales al Backend
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        
        // El backend responde con un objeto: { user: {...}, token: "..." }
        if (response.data && response.data.token) {
            // Separamos el token del perfil del usuario para no corromper los objetos
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        console.error("Error de conexión o credenciales inválidas", error);
        throw error; // Esto disparará el mensaje de error en la interfaz de Login
    }
};

const logout = () => {
    // Limpieza absoluta de las claves de sesión en el navegador
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    // Devuelve únicamente el perfil limpio del usuario (esencial para los mappers del front)
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrentUser,
};

export default authService;