import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ordenes';

const getAll = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("[OrdenService] Error obteniendo órdenes:", error);
        return []; 
    }
};

const ordenService = { getAll };
export default ordenService;