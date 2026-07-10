import api from './api';

const ENDPOINT = '/usuarios';

/**
 * Obtiene la nómina de personal de la planta soportando filtros dinámicos.
 * Mapea directo con @GetMapping de tu controlador.
 */
const getAll = async (filters = {}) => {
    try {
        const response = await api.get(ENDPOINT, { params: filters });
        return response.data;
    } catch (error) {
        console.error("[UsuarioService] Error obteniendo usuarios:", error);
        throw error;
    }
};

/**
 * Obtiene el perfil de un usuario específico mediante su identificador.
 * Mapea directo con @GetMapping("/{id}")
 */
const getById = async (id) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[UsuarioService] Error obteniendo usuario ${id}:`, error);
        throw error;
    }
};

/**
 * Registra un nuevo usuario en el sistema.
 * Mapea directo con @PostMapping
 */
const create = async (usuarioData) => {
    try {
        const response = await api.post(ENDPOINT, usuarioData);
        return response.data;
    } catch (error) {
        console.error("[UsuarioService] Error creando usuario:", error);
        throw error;
    }
};

/**
 * Actualiza los datos de un usuario existente en la base de datos.
 * Mapea directo con @PutMapping("/{id}")
 */
const update = async (id, usuarioData) => {
    try {
        const response = await api.put(`${ENDPOINT}/${id}`, usuarioData);
        return response.data;
    } catch (error) {
        console.error(`[UsuarioService] Error actualizando usuario ${id}:`, error);
        throw error;
    }
};

/**
 * Deshabilita el acceso de un operario o supervisor a la plataforma SIGEMI.
 * Mapea directo con el subpath @DeleteMapping("/deshabilitar/{id}")
 */
const remove = async (id) => {
    try {
        const response = await api.delete(`${ENDPOINT}/deshabilitar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[UsuarioService] Error deshabilitando usuario ${id}:`, error);
        throw error;
    }
};

const usuarioService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default usuarioService;