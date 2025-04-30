// src/pages/estudiante/ModificarPerfil.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import axios from "axios";

const ModificarPerfil = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/estudiantes/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstudiante(response.data);
        setNombre(response.data.nombre || "");
        setCorreo(response.data.correoInstitucional || "");
        setTelefono(response.data.celular || "");
        setFotoPerfil(response.data.fotoPerfil || "");
        setImagenPreview(response.data.fotoPerfil || "");
      } catch (error) {
        navigate("/login");
      }
    };
    fetchPerfil();
  }, [navigate]);

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
    // Validaciones simples
    const nuevosErrores = {};
    if (!nombre) nuevosErrores.nombre = "El nombre es requerido";
    if (!correo) nuevosErrores.correo = "El correo es requerido";
    if (telefono && !/^\d{7,15}$/.test(telefono)) nuevosErrores.telefono = "Número inválido";
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      setIsLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("correoInstitucional", correo);
      formData.append("celular", telefono);
      if (fotoPerfil && fotoPerfil instanceof File) {
        formData.append("fotoPerfil", fotoPerfil);
      }
      await axios.put("http://127.0.0.1:8000/estudiantes/perfil", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/perfil");
    } catch (error) {
      setErrors({ submit: "Error al actualizar el perfil. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">  
        {/* Panel lateral de perfil */}
        <PanelPerfil handleLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }} />
        {/* Formulario de modificación */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#722F37] mb-6">Modificar perfil</h1>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center">
              <img
                src={
                  imagenPreview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || "Usuario")}&background=722F37&color=fff&size=150`
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
            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
              <input
                type="email"
                className={`w-full px-3 py-2 border ${errors.correo ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
            </div>
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className={`w-full px-3 py-2 border ${errors.telefono ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 3001234567"
              />
              {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
            </div>
            {/* Botón guardar */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModificarPerfil;
