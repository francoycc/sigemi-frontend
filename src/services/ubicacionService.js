import api from './api';

const ENDPOINT = '/ubicaciones';

const getAll = async (filters = {}) => {
    try {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data; 
    } catch (error) {
        console.error("[UbicacionService] Error listando todas las ubicaciones:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[UbicacionService] Error obteniendo ubicación técnica ${id}:`, error);
        throw error;
    }
};

const create = async (ubicacionData) => {
    try {
        const response = await api.post(ENDPOINT, ubicacionData);
        return response.data;
    } catch (error) {
        console.error("[UbicacionService] Error creando ubicación técnica:", error);
        throw error;
    }
};

const update = async (id, ubicacionData) => {
    try {
        const response = await api.put(`${ENDPOINT}/${id}`, ubicacionData);
        return response.data;
    } catch (error) {
        console.error(`[UbicacionService] Error actualizando ubicación técnica ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    try {
        const response = await api.delete(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[UbicacionService] Error eliminando ubicación técnica ${id}:`, error);
        throw error;
    }
};

/**
 * Carga los nodos hijos de la jerarquía de planta de forma dinámica.
 * Se mapea directamente con @GetMapping("/hijos") y el @RequestParam padreId
 */
const getByParentId = async (padreId) => {
    try {
        const params = padreId ? { padreId: padreId } : {}; 
        const response = await api.get(`${ENDPOINT}/hijos`, { params });
        return response.data;
    } catch (error) {
        console.error(`[UbicacionService] Error obteniendo jerarquía para padreId ${padreId || 'RAIZ'}:`, error);
        throw error;
    }
};

const ubicacionService = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByParentId
};

export default ubicacionService;