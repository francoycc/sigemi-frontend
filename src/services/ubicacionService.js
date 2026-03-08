import axios from 'axios';

// URL del Backend
const API_URL = 'http://localhost:8080/api/ubicaciones';


const getAll = async () => {
    console.log(`[UbicacionService] Solicitando TODAS las ubicaciones`);
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("[UbicacionService] Error obteniendo todas las ubicaciones:", error);
        throw error;
    }
};

const getByParentId = async (parentId) => {
   console.log(`[UbicacionService] Solicitando hijos para ID Padre: ${parentId || 'RAIZ'}`);

    try {
        const params = parentId ? { padreId: parentId } : {}; 
        
        const response = await axios.get(`${API_URL}/hijos`, { params });
        
        console.log("[UbicacionService] Respuesta del Backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("[UbicacionService] Error obteniendo jerarquía:", error.response ? error.response.status : error.message);
        throw error;
    }
};

const getById = async (id) => {
    console.log(`[UbicacionService] Solicitando detalle para ID: ${id}`);
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        console.log("[UbicacionService] Detalle recibido:", response.data);
        return response.data;
    } catch (error) {
        console.error("[UbicacionService] Error obteniendo detalle:", error);
        throw error;
    }
};

const create = async (ubicacionData) => {
    console.log(`[UbicacionService] Alta ubicacion: `, ubicacionData);
    try {
        const response = await axios.post(API_URL, ubicacionData);
        return response.data;
    } catch (error) {
        console.error("[UbicacionService] Error creando ubicación:", error);
        throw error;
    }
};

const update = async (id, ubicacionData) => {
    console.log(`[UbicacionService] Modificando ubicacion ID ${id}: `, ubicacionData);
    try{
        const response = await axios.put(`${API_URL}/${id}`, ubicacionData);
        return response.data;
    } catch (error) {
        console.error(`[UbicacionService] Error modificando ubicación ID ${id}:`, error);
        throw error;
    }
};

const remove = async (id) => {
    console.log(`[UbicacionService] Baja de ubicacion con ID ${id}`);
    try{
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch(error){
        console.error("[UbicacionService] Error eliminando ubicación:", error);
        throw error;
    }
};


const ubicacionService = {
    getAll,
    getByParentId,
    getById,
    create,
    update,
    remove
};

export default ubicacionService;
