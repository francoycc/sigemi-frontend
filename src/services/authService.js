import axios from 'axios';

// Apunta a tu servidor Spring Boot real
const API_URL = 'http://localhost:8080/api/auth';

const login = async (username, password) => {
    try {
        // CONEXIÓN REAL: Envía los datos al Backend
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        
        // Si el backend responde OK (200), guardamos al usuario
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error("Error de conexión o credenciales inválidas", error);
        throw error; // Esto disparará el mensaje de error rojo en el Login
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    login,
    logout,
    getCurrentUser,
};

export default authService;