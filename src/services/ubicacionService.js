import axios from 'axios';

// URL del Backend
const API_URL = 'http://localhost:8080/api/ubicaciones';

const getByParentId = async (parentId) => {
   console.log(`[Service] Solicitando hijos para ID Padre: ${parentId || 'RAIZ'}`);

    try {
        const params = parentId ? { padreId: parentId } : {}; 
        
        const response = await axios.get(`${API_URL}/hijos`, { params });
        
        console.log("[Service] Respuesta del Backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("[Service] Error obteniendo jerarquía:", error.response ? error.response.status : error.message);
        throw error;
    }
};

const getById = async (id) => {
    console.log(`📡 [Service] Solicitando detalle para ID: ${id}`);
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        console.log("[Service] Detalle recibido:", response.data);
        return response.data;
    } catch (error) {
        console.error("[Service] Error obteniendo detalle:", error);
        throw error;
    }
};

const ubicacionService = {
    getByParentId,
    getById,
};

export default ubicacionService;
