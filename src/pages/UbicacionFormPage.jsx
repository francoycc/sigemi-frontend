import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ubicacionService from '../services/ubicacionService';

const UbicacionFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Estado para el formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        tipo: '',
        estado: 'Operativo', // Valor por defecto basado en tu Enum
        idPadre: ''
    });

    // Estado para guardar las ubicaciones y llenar el select de "Ubicación Padre"
    const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);

    useEffect(() => {
        // 1. Cargar TODAS las ubicaciones para el desplegable de "Padre" (Usamos el nuevo getAll)
        ubicacionService.getAll()
            // En tus otros métodos de service, devuelves directamente 'response.data', 
            // así que aquí recibimos la data directamente en 'res', no en 'res.data'
            .then(data => setUbicacionesDisponibles(data))
            .catch(err => console.error("Error al cargar ubicaciones disponibles:", err));

        // 2. Si estamos en modo edición, traemos los datos de la ubicación a editar (Usamos getById)
        if (isEditMode) {
            ubicacionService.getById(id)
                .then(data => {
                    // Mismo caso aquí, el service ya retorna response.data
                    setFormData({
                        codigo: data.codigo || '',
                        nombre: data.nombre || '',
                        tipo: data.tipo || '',
                        estado: data.estado || 'Operativo',
                        idPadre: data.idPadre || '' // Si es null, lo pasamos a string vacío para el select
                    });
                })
                .catch(err => {
                    console.error("Error al obtener la ubicación:", err);
                    alert("No se pudo cargar la información de la ubicación.");
                    navigate('/ubicaciones'); // Lo devolvemos a la lista si falla
                });
        }
    }, [id, isEditMode, navigate]);

    // Manejador genérico para los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador del submit (Crear o Actualizar)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Preparamos el payload. Si idPadre está vacío, lo mandamos como null al backend
        const payload = {
            ...formData,
            idPadre: formData.idPadre === '' ? null : parseInt(formData.idPadre)
        };

        // Usamos update y create
        const request = isEditMode
            ? ubicacionService.update(id, payload)
            : ubicacionService.create(payload);

        request
            .then(() => {
                // Si todo sale bien, volvemos al listado
                navigate('/ubicaciones');
            })
            .catch(err => {
                console.error(err);
                // Mostramos el mensaje de error que viene del backend (BusinessException o Validation)
                const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error desconocido al guardar";
                alert(`Error al guardar: ${errorMsg}`);
            });
    };

    return (
        <div className="p-4 max-w-2xl mx-auto mt-6">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                    {isEditMode ? 'Editar Ubicación Técnica' : 'Nueva Ubicación Técnica'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Fila 1: Código y Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Código</label>
                            <input 
                                type="text" 
                                name="codigo" 
                                value={formData.codigo} 
                                onChange={handleChange} 
                                required 
                                disabled={isEditMode} // Deshabilitado en edición por seguridad
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditMode ? 'bg-gray-100' : ''}`}
                                placeholder="Ej. PLANTA-01"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Estado Operativo</label>
                            <select 
                                name="estado" 
                                value={formData.estado} 
                                onChange={handleChange} 
                                required 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                                {/* Valores exactos de tu Enum en el Backend */}
                                <option value="Operativo">Operativo</option>
                                <option value="EnReparacion">En Reparación</option>
                                <option value="FueraDeServicio">Fuera de Servicio</option>
                            </select>
                        </div>
                    </div>

                    {/* Fila 2: Nombre */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Ej. Línea de Producción A"
                        />
                    </div>

                    {/* Fila 3: Tipo y Ubicación Padre */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tipo</label>
                            <input 
                                type="text" 
                                name="tipo" 
                                value={formData.tipo} 
                                onChange={handleChange} 
                                required 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Ej. Sector, Máquina, Edificio"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Ubicación Padre (Opcional)</label>
                            <select 
                                name="idPadre" 
                                value={formData.idPadre} 
                                onChange={handleChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white">
                                <option value="">-- Ninguna (Nodo Raíz) --</option>
                                
                                {ubicacionesDisponibles
                                    // Filtramos para evitar que una ubicación sea padre de sí misma
                                    .filter(ubi => !isEditMode || ubi.idUbicacion !== parseInt(id))
                                    .map(ubi => (
                                        <option key={ubi.idUbicacion} value={ubi.idUbicacion}>
                                            {ubi.codigo} - {ubi.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    {/* Fila 4: Botones de Acción */}
                    <div className="flex items-center justify-end space-x-4 pt-4 mt-6 border-t">
                        <button 
                            type="button" 
                            onClick={() => navigate('/ubicaciones')} 
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition">
                            Guardar Ubicación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UbicacionFormPage;