import { useState } from "react";
import axios from "axios";

const EditarPerfilModal = ({ isOpen, onClose, estudiante, onPerfilActualizado }) => {
  const [nombre, setNombre] = useState(estudiante?.nombre || "");
  const [correoInstitucional, setCorreoInstitucional] = useState(estudiante?.correoInstitucional || "");
  const [fotoPerfil, setFotoPerfil] = useState(estudiante?.fotoPerfil || "");
  const [celular, setCelular] = useState(estudiante?.celular || "");
  const [correoAlterno, setCorreoAlterno] = useState(estudiante?.correoAlterno || "");
  const [imagenPreview, setImagenPreview] = useState(estudiante?.fotoPerfil || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validaciones mínimas
    const nuevosErrores = {};
    if (!nombre) nuevosErrores.nombre = "El nombre es requerido";
    if (!correoInstitucional) nuevosErrores.correoInstitucional = "El correo institucional es requerido";
    if (celular && !/^\d{7,15}$/.test(celular)) nuevosErrores.celular = "Número inválido";

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      setIsLoading(false);
      return;
    }

    // Preparar datos para enviar (ajusta según tu backend)
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correoInstitucional", correoInstitucional);
    formData.append("celular", celular);
    formData.append("correoAlterno", correoAlterno);
    if (fotoPerfil && fotoPerfil instanceof File) {
      formData.append("fotoPerfil", fotoPerfil);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:8000/estudiantes/perfil", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      if (onPerfilActualizado) onPerfilActualizado();
      onClose();
    } catch (error) {
      setErrors({ submit: "Error al actualizar el perfil. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Editar Perfil</h2>
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {errors.submit}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Foto de perfil */}
          <div className="flex flex-col items-center">
            <img
              src={
                imagenPreview ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'Usuario')}&background=722F37&color=fff&size=150`
              }
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#722F37] mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm mt-2"
            />
          </div>
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${errors.nombre ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>
          {/* Correo institucional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
            <input
              type="email"
              className={`w-full px-3 py-2 border ${errors.correoInstitucional ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={correoInstitucional}
              onChange={(e) => setCorreoInstitucional(e.target.value)}
              required
            />
            {errors.correoInstitucional && <p className="mt-1 text-sm text-red-600">{errors.correoInstitucional}</p>}
          </div>
          {/* Celular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número celular</label>
            <input
              type="tel"
              className={`w-full px-3 py-2 border ${errors.celular ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              placeholder="Ej: 3001234567"
            />
            {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
          </div>
          {/* Correo alterno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo alterno (opcional)</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={correoAlterno}
              onChange={(e) => setCorreoAlterno(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          {/* Botón guardar */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilModal;
