import axios from 'axios';

const API_URL = 'http://localhost:8080/api/equipos';

const getAll = async () => {
    try {
        console.log(`[EquipoService] Solicitando lista de equipos:`);
        const response = await axios.get(API_URL);
        
        return response.data.content || response.data; 
    } catch (error) {
        console.error("[EquipoService] Error obteniendo equipos:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        console.log(`[EquipoService] Solicitando detalle del equipo ID: ${id}`);
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error obteniendo detalle del equipo ${id}:`, error);
        throw error;
    }
};

const getByUbicacion = async (idUbicacion) => {
    try {
        const response = await axios.get(`${API_URL}/ubicacion/${idUbicacion}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error obteniendo equipos para ubicación ${idUbicacion}:`, error);
        throw error;
    }
};

const create = async (equipoData) => {
    try {
        console.log(`[EquipoService] Creando nuevo equipo:`, equipoData);
        const response = await axios.post(API_URL, equipoData);
        return response.data;
    } catch (error) {
        console.error("[EquipoService] Error creando equipo:", error);
        throw error;
    }
};

const update = async (id, equipoData) => {
    try {
        console.log(`[EquipoService] Modificando equipo ID ${id}:`, equipoData);
        const response = await axios.put(`${API_URL}/${id}`, equipoData);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error modificando equipo ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    try {
        console.log(`[EquipoService] Eliminando equipo ID ${id}`);
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error eliminando equipo ${id}:`, error);
        throw error;
    }
};

const equipoService = {
    getAll,
    getById,
    getByUbicacion,
    create,
    update,
    remove
};

export default equipoService;