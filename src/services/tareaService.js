import api from './api';

const ENDPOINT = '/tareas';

const getAll = async (filters = {}) => {
    try {
        // Soporte nativo para filtros dinámicos (Ej: por estado o criticidad)
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    } catch (error) {
        console.error("[TareaService] Error listando tareas:", error);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error obteniendo tarea ${id}:`, error);
        throw error;
    }
};

const create = async (tareaData) => {
    try {
        const response = await api.post(ENDPOINT, tareaData);
        return response.data;
    } catch (error) {
        console.error("[TareaService] Error creando tarea:", error);
        throw error;
    }
};

const update = async (id, tareaData) => {
    try {
        const response = await api.put(`${ENDPOINT}/${id}`, tareaData);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error actualizando tarea ${id}:`, error);
        throw error;
    }
};

/**
 * Obtiene las subtareas asociadas a una Orden de Trabajo específica.
 * Mapea directo con @GetMapping("/orden/{idOrden}")
 */
const getByOrden = async (idOrden) => {
    try {
        const response = await api.get(`${ENDPOINT}/orden/${idOrden}`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error listando tareas de la orden ${idOrden}:`, error);
        throw error;
    }
};

/**
 * Carga la cola operativa del operario logueado.
 * Mapea directo con @GetMapping("/tecnico/{idTecnico}")
 */
const getByTecnico = async (idTecnico) => {
    try {
        const response = await api.get(`${ENDPOINT}/tecnico/${idTecnico}`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error listando tareas del técnico ${idTecnico}:`, error);
        throw error;
    }
};

/**
 * Cambia el estado de una tarea a pausa sin destruir la entidad.
 * Mapea directo con @PatchMapping("/{id}/pausar")
 */
const pause = async (id) => {
    try {
        const response = await api.patch(`${ENDPOINT}/${id}/pausar`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error pausando tarea ${id}:`, error);
        throw error;
    }
};

const tareaService = {
    getAll,
    getById,
    create,
    update,
    getByOrden,
    getByTecnico,
    pause
};

export default tareaService;