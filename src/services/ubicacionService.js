import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ubicaciones';

const MOCK_DATA = [
    { id: 1, codigo: 'PL-01-SEC-A', nombre: 'Planta Principal - Sector A', planta: 'Planta Rosario', estado: 'Activo' }
    //{ id: 2, codigo: 'PL-01-SEC-B', nombre: 'Planta Principal - Sector B', planta: 'Planta Rosario', estado: 'Activo' },
    //{ id: 3, codigo: 'ALM-GEN', nombre: 'Almacén General', planta: 'Depósito Central', estado: 'Activo' },    
];

const getAll = async () => {
    try {
        // Linea conectada para backend
        // const response = await axios.get(API_URL); return response.data;
        return new Promise(resolve => setTimeout(() => resolve(MOCK_DATA), 500));
    } catch (error) {
        console.error("Error fetching ubicaciones", error);
        throw error;
    }
};
const ubicacionService = {
    getAll,
};

export default ubicacionService;
