import React, { useState, useEffect } from "react";
import SolicitarIntercambioModal from "./SolicitarIntercambioModal";
import axios from "axios";

const LibroDetalleModal = ({
  libro,
  isOpen,
  onClose,
  esPropio,
  onSolicitarIntercambio,
  actualizarLibros // función para refrescar la lista de libros en el padre
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
  

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (modoEdicion && categorias.length === 0) {
      axios.get("http://localhost:8000/categorias")
        .then(res => setCategorias(res.data))
        .catch(() => setCategorias([]));
    }
  }, [modoEdicion, categorias.length]);

  // Resetear estado al abrir/cambiar libro
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
  let usuarioFotoUrl = libro.usuarioFoto;
  if (usuarioFotoUrl && !usuarioFotoUrl.startsWith("http")) {
    usuarioFotoUrl = `http://localhost:8000${usuarioFotoUrl}`;
  }
  if (!usuarioFotoUrl) {
    usuarioFotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(libro.usuarioNombre || "Usuario")}&background=722F37&color=fff&size=36`;
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Imagen del libro */}
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center md:rounded-l-lg">
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
                    <h2 className="text-2xl font-bold text-[#722F37] mb-2">{libro.titulo}</h2>
                    <div className="mb-4 flex items-center">
                      <img
                        src={`http://localhost:8000${libro.estudiante.fotoPerfil}`}
                        alt={usuarioFotoUrl}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-[#722F37] object-cover"
                      />
                      <span className="text-gray-700">
                        Publicado por <span className="font-semibold">{libro.usuarioNombre}</span>
                      </span>
                      <span className="text-sm text-gray-500 ml-4">{libro.fechaPublicacion}</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                      <div>
                        <span className="font-semibold text-[#722F37]">Autor:</span> {libro.autor}
                      </div>
                      <div>
                        <span className="font-semibold text-[#722F37]">Categoría:</span> {libro.categoria}
                      </div>
                      <div>
                        <span className="font-semibold text-[#722F37]">Estado:</span>
                        <span
                          className={`ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-semibold ${
                            libro.estado === "Disponible"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {libro.estado === "Disponible" && (
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <circle cx="10" cy="10" r="10" />
                            </svg>
                          )}
                          {libro.estado}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#722F37] block mb-1">Descripción:</span>
                        <p className="text-gray-700 text-sm">{libro.descripcion}</p>
                      </div>
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
                        disabled={libro.estado !== "Disponible"}
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
