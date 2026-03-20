import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tareas';

const getAll = async () => {
    console.log("[TareaService] Listando tareas...");
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("[TareaService] Error listando tareas:", error);
        throw error;
    }
};

const getById = async (id) => {
    console.log(`[TareaService] Obteniendo tarea ${id}...`);
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error obteniendo tarea ${id}:`, error);
        throw error;
    }
};

const create = async (tareaData) => {
    console.log("[TareaService] Creando tarea...", tareaData);
    try {
        const response = await axios.post(API_URL, tareaData);
        return response.data;
    } catch (error) {
        console.error("[TareaService] Error creando tarea:", error);
        throw error;
    }
};

const update = async (id, tareaData) => {
    console.log(`[TareaService] Actualizando tarea ${id}...`, tareaData);
    try {
        const response = await axios.put(`${API_URL}/${id}`, tareaData);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error actualizando tarea ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    console.log(`[TareaService] Eliminando tarea ${id}...`);
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[TareaService] Error eliminando tarea ${id}:`, error);
        throw error;
    }
};

const tareaService = { 
    getAll, 
    getById, 
    create, 
    update, 
    remove 
};
export default tareaService;