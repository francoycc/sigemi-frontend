import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuarios';

const getAll = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("[UsuarioService] Error obteniendo usuarios:", error);
        return []; // Retornamos array vacío para que el select de React no se rompa
    }
};

const usuarioService = { getAll };
export default usuarioService;