import React, { useState, useEffect } from "react";
import SolicitarIntercambioModal from "./SolicitarIntercambioModal";
import axios from "axios";
import { FiUser, FiBookOpen, FiLayers, FiInfo, FiCheckCircle, FiX } from "react-icons/fi";

const LibroDetalleModal = ({
  libro,
  isOpen,
  onClose,
  esPropio,
  onSolicitarIntercambio,
  actualizarLibros
}) => {
  const [mostrarModalSolicitud, setMostrarModalSolicitud] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    titulo: libro?.titulo || "",
    autor: libro?.autor || "",
    descripcion: libro?.descripcion || "",
    idCategoria: libro?.idCategoria || "",
    nueva_foto: null,
  });
  const [imagenPreview, setImagenPreview] = useState(libro?.fotoLibro || "");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (modoEdicion && categorias.length === 0) {
      axios.get("http://localhost:8000/categorias")
        .then(res => setCategorias(res.data))
        .catch(() => setCategorias([]));
    }
  }, [modoEdicion, categorias.length]);

  useEffect(() => {
    if (libro) {
      setForm({
        titulo: libro.titulo,
        autor: libro.autor,
        descripcion: libro.descripcion,
        idCategoria: libro.idCategoria,
        nueva_foto: null,
      });
      setImagenPreview(libro.fotoLibro);
      setModoEdicion(false);
      setConfirmarEliminar(false);
      setMensaje("");
      setError("");
    }
  }, [libro, isOpen]);

  if (!isOpen || !libro) return null;

  // Foto del usuario que publicó el libro
  let usuarioFotoUrl = libro.estudiante?.fotoPerfil;
  if (usuarioFotoUrl && !usuarioFotoUrl.startsWith("http")) {
    usuarioFotoUrl = `http://localhost:8000${usuarioFotoUrl}`;
  }
  if (!usuarioFotoUrl) {
    usuarioFotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(libro.estudiante?.nombre || "Usuario")}&background=722F37&color=fff&size=36`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, nueva_foto: file }));
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleEditarLibro = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("autor", form.autor);
      formData.append("descripcion", form.descripcion);
      formData.append("idCategoria", form.idCategoria);
      if (form.nueva_foto) formData.append("nueva_foto", form.nueva_foto);

      await axios.put(`http://localhost:8000/libros/${libro.idLibro}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje("¡Libro editado exitosamente!");
      setModoEdicion(false);
      actualizarLibros && actualizarLibros();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Error al editar el libro. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarLibro = async () => {
    setIsLoading(true);
    setError("");
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/libros/${libro.idLibro}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("¡Libro eliminado exitosamente!");
      actualizarLibros && actualizarLibros();
      setTimeout(() => {
        setIsLoading(false);
        setConfirmarEliminar(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Error al eliminar el libro. Intenta nuevamente."
      );
      setIsLoading(false);
    }
  };

  // Estado visual
  const estadoDisponible = libro.estado === "Disponible";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4">
          {/* Barra superior */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#722F37] rounded-t-lg">
            <div className="flex items-center gap-4">
              <img
                src={usuarioFotoUrl}
                alt={libro.estudiante?.nombre}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <div>
                <div className="text-white font-semibold flex items-center gap-2">
                  <FiUser className="inline-block" /> {libro.estudiante?.nombre || "Usuario"}
                </div>
                <div className="text-gray-200 text-xs">{libro.fechaPublicacion}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white flex items-center gap-2">
                <FiCheckCircle className={estadoDisponible ? "text-green-300" : "text-gray-300"} />
                {libro.estado}
              </span>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl focus:outline-none"
                aria-label="Cerrar"
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Imagen del libro */}
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center md:rounded-bl-lg">
              <img
                src={imagenPreview}
                alt={form.titulo}
                className="max-h-96 object-contain rounded-md shadow-md border"
              />
            </div>

            {/* Detalles y acciones */}
            <div className="md:w-2/3 p-6 md:p-8 flex flex-col gap-8">
              {/* Mensajes */}
              {mensaje && (
                <div className="mb-2 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center font-semibold">
                  {mensaje}
                </div>
              )}
              {error && (
                <div className="mb-2 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center font-semibold">
                  {error}
                </div>
              )}

              {/* Vista normal */}
              {!modoEdicion && !confirmarEliminar && (
                <>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#722F37] mb-2 flex items-center gap-2">
                      <FiBookOpen className="text-Swap-beige" />
                      {libro.titulo}
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiUser className="text-Swap-beige" />
                        <span className="font-semibold">Autor:</span>
                        <span>{libro.autor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiLayers className="text-Swap-beige" />
                        <span className="font-semibold">Categoría:</span>
                        <span>{libro.categoria}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FiInfo className="text-Swap-beige" />
                      <span className="font-semibold text-[#722F37]">Descripción:</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-gray-700 text-sm mb-4 max-h-32 overflow-y-auto">
                      {libro.descripcion}
                    </div>
                  </div>
                  {/* Acciones */}
                  <div className="w-full flex flex-col items-center mt-4">
                    {esPropio ? (
                      <div className="w-full md:w-44 flex flex-col space-y-4">
                        <button
                          onClick={() => setModoEdicion(true)}
                          className="w-full py-3 bg-Swap-beige text-white rounded-md font-semibold hover:bg-[#a67c52] transition-colors flex items-center justify-center gap-2"
                        >
                          Editar libro
                        </button>
                        <button
                          onClick={() => setConfirmarEliminar(true)}
                          className="w-full py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          Eliminar libro
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMostrarModalSolicitud(true)}
                        className="w-full md:w-60 py-3 bg-Swap-green text-white rounded-md font-semibold hover:bg-Swap-green-dark transition-colors flex items-center justify-center gap-2 mt-2"
                        disabled={!estadoDisponible}
                      >
                        Solicitar Intercambio
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Modo edición */}
              {modoEdicion && (
                <form onSubmit={handleEditarLibro} className="space-y-4">
                  <h3 className="text-xl font-bold text-[#722F37] mb-2">Editar libro</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      name="titulo"
                      value={form.titulo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                    <input
                      name="autor"
                      value={form.autor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      name="idCategoria"
                      value={form.idCategoria}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.idCategoria} value={cat.idCategoria}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva foto (opcional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setModoEdicion(false)}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-Swap-beige text-white rounded-md hover:bg-[#a67c52] disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}

              {/* Confirmar eliminación */}
              {confirmarEliminar && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-700 mb-2">¿Eliminar libro?</h3>
                  <p className="text-gray-700">
                    Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este libro?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmarEliminar(false)}
                      className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleEliminarLibro}
                      className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? "Eliminando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de solicitud de intercambio */}
      {mostrarModalSolicitud && (
        <SolicitarIntercambioModal
          isOpen={mostrarModalSolicitud}
          onClose={() => setMostrarModalSolicitud(false)}
          libroSolicitado={libro}
          onSolicitudEnviada={onSolicitarIntercambio}
        />
      )}
    </>
  );
};

export default LibroDetalleModal;
