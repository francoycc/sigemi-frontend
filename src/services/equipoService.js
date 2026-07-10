import api from './api';

const ENDPOINT = '/equipos';

/**
 * Obtiene la lista de equipos soportando paginación, ordenamiento y filtros dinámicos.
 * @param {Object} filters - Objeto con filtros (Ej: { page: 0, size: 10, nombre: 'Torno', criticidad: 'ALTA' })
 */
const getAll = async (filters = {}) => {
    try {
        // Pasamos los filtros como query params (?page=0&size=10...) de forma limpia
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data; 
    } catch (error) {
        console.error("[EquipoService] Error listando equipos:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error obteniendo equipo ${id}:`, error);
        throw error;
    }
};

const create = async (equipoData) => {
    try {
        const response = await api.post(ENDPOINT, equipoData);
        return response.data;
    } catch (error) {
        console.error("[EquipoService] Error creando equipo:", error);
        throw error;
    }
};

const update = async (id, equipoData) => {
    try {
        const response = await api.put(`${ENDPOINT}/${id}`, equipoData);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error actualizando equipo ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    try {
        // Mapea directamente al @DeleteMapping de tu controlador (desactivar)
        const response = await api.delete(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error eliminando equipo ${id}:`, error);
        throw error;
    }
};

/**
 * Obtiene los equipos instalados en una ubicación técnica específica.
 * Mapea directamente con @GetMapping("/ubicacion/{idUbicacion}")
 */
const getByUbicacion = async (idUbicacion) => {
    try {
        const response = await api.get(`${ENDPOINT}/ubicacion/${idUbicacion}`);
        return response.data;
    } catch (error) {
        console.error(`[EquipoService] Error buscando equipos por ubicación ${idUbicacion}:`, error);
        throw error;
    }
};

const equipoService = {
    getAll,
    getById,
    create,
    update,
    remove,
    getByUbicacion
};

export default equipoService;