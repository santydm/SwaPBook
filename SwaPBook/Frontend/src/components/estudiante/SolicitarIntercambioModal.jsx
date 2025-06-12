// src/components/SolicitarIntercambioModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import LibroMiniCard from "./LibroMiniCard";
import { FiMapPin, FiRepeat, FiCheckCircle } from "react-icons/fi";

const getCategoriaNombre = (categoria) => {
  if (!categoria) return "Sin categoría";
  if (typeof categoria === "string") return categoria;
  if (categoria.nombre) return categoria.nombre;
  return "Sin categoría";
};

const getFotoUrl = (foto) => {
  if (!foto || foto.trim() === "") return "/images/book-placeholder.png";
  if (foto.startsWith("http")) return foto;
  return `http://localhost:8000${foto}`;
};

const SolicitarIntercambioModal = ({
  isOpen,
  onClose,
  libroSolicitado,
}) => {
  const [misLibros, setMisLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [fechaEncuentro, setFechaEncuentro] = useState('');
  const [horaEncuentro, setHoraEncuentro] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarMisLibros();
    }
  }, [isOpen]);

  const cargarMisLibros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const perfilResponse = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const idEstudiante = perfilResponse.data.idEstudiante;
      const librosResponse = await axios.get(`http://127.0.0.1:8000/libros/mis-libros/${idEstudiante}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const librosDisponibles = librosResponse.data.filter(libro =>
        libro.estado === "Disponible"
      );
      setMisLibros(librosDisponibles);
    } catch (error) {
      setError('No se pudieron cargar tus libros. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!libroSeleccionado) {
      setError('Debes seleccionar un libro para ofrecer');
      return;
    }
    if (!fechaEncuentro || !horaEncuentro) {
      setError('Debes especificar fecha y hora de encuentro');
      return;
    }
    try {
      setEnviando(true);
      const token = localStorage.getItem('token');
      const fechaHoraEncuentro = new Date(`${fechaEncuentro}T${horaEncuentro}`);
      const data = {
        libroOfrecido: libroSeleccionado.idLibro,
        libroSolicitado: libroSolicitado.idLibro,
        lugarEncuentro: "El Matorral",
        fechaEncuentro: fechaHoraEncuentro.toISOString(),
        horaEncuentro: fechaHoraEncuentro.toISOString()
      };
      await axios.post('http://127.0.0.1:8000/solicitudes/', data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMostrarExito(true);
      setTimeout(() => {
      setMensajeExito('');
      onClose();
      window.location.reload();
    }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleCerrarExito = () => {
    setMostrarExito(false);
    onClose();
  };

  if (!isOpen) return null;

  const fotoSolicitada = getFotoUrl(libroSolicitado?.fotoLibro || libroSolicitado?.foto);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl  mx-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#722F37] mb-6 text-center">Solicitar Intercambio</h2>
            {/* Previsualización del intercambio */}
            <div className="flex items-center justify-center gap-8 mb-8">
              {/* Solicitando */}
              <div className="flex flex-col items-center max-w-xs flex-1">
                <span className="font-semibold text-[#722F37] mb-2">Solicitando</span>
                <div className="border-2 border-green-500 bg-white p-4 rounded-lg flex flex-col items-center w-48">
                  <img
                    src={fotoSolicitada}
                    alt={libroSolicitado.titulo}
                    className="w-24 h-32 object-cover rounded mb-2 border border-gray-300"
                  />
                  <div className="text-center">
                    <p className="font-bold text-[#722F37] text-base truncate">{libroSolicitado.titulo}</p>
                    <p className="text-sm text-gray-700">{libroSolicitado.autor}</p>
                    <p className="text-xs text-gray-500">{getCategoriaNombre(libroSolicitado.categoria)}</p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">{libroSolicitado.descripcion}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <FiRepeat className="text-3xl text-Swap-beige mb-2" />
              </div>
              {/* Ofreciendo */}
              <div className="flex flex-col items-center max-w-xs flex-1">
                <span className="font-semibold text-[#722F37] mb-2">Ofreciendo</span>
                <div className="border-2 border-green-500 bg-white p-4 rounded-lg flex flex-col items-center w-48 min-h-[240px] justify-center">
                  {libroSeleccionado ? (
                    <>
                      <img
                        src={getFotoUrl(libroSeleccionado.foto)}
                        alt={libroSeleccionado.titulo}
                        className="w-24 h-32 object-cover rounded mb-2 border border-gray-300"
                      />
                      <div className="text-center">
                        <p className="font-bold text-[#722F37] text-base truncate">{libroSeleccionado.titulo}</p>
                        <p className="text-sm text-gray-700">{libroSeleccionado.autor}</p>
                        <p className="text-xs text-gray-500">{getCategoriaNombre(libroSeleccionado.categoria)}</p>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-3">{libroSeleccionado.descripcion}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">Selecciona un libro</span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Lugar de encuentro</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="El Matorral"
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#722F37] bg-gray-100"
                  />
                  <a
                    href="https://maps.app.goo.gl/ridUkDvUjJiwez8v9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-Swap-beige hover:text-[#a67c52]"
                    title="Ver en Google Maps"
                  >
                    <FiMapPin className="text-2xl" />
                  </a>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Selecciona un libro para ofrecer:</h3>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                    <span className="ml-4 text-[#722F37] font-semibold">Cargando tus libros...</span>
                  </div>
                ) : misLibros.length === 0 ? (
                  <div className="text-center p-4 bg-yellow-100 rounded">
                    No tienes libros disponibles para intercambio. Publica algunos primero.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-2">
                    {misLibros.map(libro => (
                      <LibroMiniCard
                        key={libro.idLibro}
                        libro={libro}
                        seleccionado={libroSeleccionado?.idLibro === libro.idLibro}
                        onClick={() => setLibroSeleccionado(libro)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Fecha de encuentro</label>
                  <input
                    type="date"
                    value={fechaEncuentro}
                    onChange={(e) => setFechaEncuentro(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Hora de encuentro</label>
                  <input
                    type="time"
                    value={horaEncuentro}
                    onChange={(e) => setHoraEncuentro(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-Swap-green text-white rounded-md hover:bg-Swap-green-dark disabled:opacity-50"
                  disabled={enviando || loading || misLibros.length === 0 || !libroSeleccionado}
                >
                  {enviando ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {mostrarExito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="text-center">
              <FiCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#722F37] mb-2">
                ¡Solicitud enviada!
              </h3>
              <p className="text-gray-600 mb-6">
                Solicitud Enviada con éxito. El propietario del libro será notificado y podrá aceptar o rechazar tu solicitud.
              </p>
              <button
                onClick={handleCerrarExito}
                className="w-full py-2 px-4 bg-Swap-beige text-white rounded-md hover:bg-[#a67c52] transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolicitarIntercambioModal;
