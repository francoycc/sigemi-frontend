import api from './api';

const login = async (username, password) => {
    // 1. Creamos la cabecera de autenticación Basic (Base64)
    // btoa() es una función nativa de JS para codificar a Base64
    const token = 'Basic ' + btoa(username + ':' + password);

    try {
        // 2. Hacemos una petición de prueba a un endpoint protegido
        // Usamos /usuarios para probar (o cualquier endpoint que requiera auth)
        const response = await api.get('/usuarios', {
            headers: { 'Authorization': token }
        });

        // 3. Si la respuesta es exitosa (200 OK), guardamos los datos
        // en backend endpoint /me que devuelva los datos del usuario.
        const userData = {
            username: username,
            authHeader: token,
            // rol: 'SUPERVISOR' (Esto lo deberíamos obtener del backend más adelante)
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;

    } catch (error) {
        console.error("Error de login", error);
        throw error;
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