import api from './api';

const ENDPOINT = '/ordenes';

const getAll = async () => {
    try {
        const response = await api.get(ENDPOINT);
        return response.data; 
    } catch (error) {
        console.error("[OrdenService] Error listando órdenes:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[OrdenService] Error obteniendo orden ${id}:`, error);
        throw error;
    }
};

const create = async (ordenData) => {
    try {
        const response = await api.post(ENDPOINT, ordenData);
        return response.data;
    } catch (error) {
        console.error("[OrdenService] Error creando orden:", error);
        throw error;
    }
};

const update = async (id, ordenData) => {
    try {
        const response = await api.put(`${ENDPOINT}/${id}`, ordenData);
        return response.data;
    } catch (error) {
        console.error(`[OrdenService] Error actualizando orden ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    try {
        const response = await api.delete(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[OrdenService] Error eliminando orden ${id}:`, error);
        throw error;
    }
};

const ordenService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default ordenService;