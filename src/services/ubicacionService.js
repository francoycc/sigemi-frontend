import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ubicaciones';

const MOCK_HIERARCHY = [
    { id: 'ROOT', codigo: 'CORP', nombre: 'Corporación General', tipo: 'Corporación', padreId: null },
    { id: 'PL-01', codigo: 'PL-ROS', nombre: 'Planta Rosario', tipo: 'Planta', padreId: 'ROOT' },
    { id: 'PL-02', codigo: 'PL-BUE', nombre: 'Planta Buenos Aires', tipo: 'Planta', padreId: 'ROOT' },
    { id: 'SEC-A', codigo: 'SEC-A', nombre: 'Sector Producción A', tipo: 'Sector', padreId: 'PL-01' },
    { id: 'SEC-B', codigo: 'SEC-B', nombre: 'Sector Empaque B', tipo: 'Sector', padreId: 'PL-01' },
    { id: 'LIN-01', codigo: 'L1-CNC', nombre: 'Línea CNC', tipo: 'Línea', padreId: 'SEC-A' },
];

const getById = async (id) => {
    console.log("Entrando a la funcion getById() con: ", id);
    try{
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error encontrando ubicacion by id", error);
        throw error;
    }
};

const getByParentId = async (parentId) => {
    console.log("Entrando a la funcion getByParentId() con: ", parentId);
    try {
        const params = parentId ?{ padreId : parentId } : {};
        const response = await axios.get('&{API_URL}/hijos', { params });

        return response.data;
    } catch (error) {
        console.error("Error encontrando ubicaciones by parentId", error);
        throw error;
    }
};

const ubicacionService = {
    getById,
    getByParentId
};

export default ubicacionService;
