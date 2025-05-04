// src/components/estudiante/SolicitarIntercambioModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import LibroMiniCard from "./LibroMiniCard";


const SolicitarIntercambioModal = ({ 
  isOpen, 
  onClose, 
  libroSolicitado, 
  onSolicitudEnviada 
}) => {
  const [misLibros, setMisLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [lugarEncuentro, setLugarEncuentro] = useState('');
  const [fechaEncuentro, setFechaEncuentro] = useState('');
  const [horaEncuentro, setHoraEncuentro] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarMisLibros();
    }
  }, [isOpen]);

  const cargarMisLibros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Primero obtenemos el perfil para tener el ID del estudiante
      const perfilResponse = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const idEstudiante = perfilResponse.data.idEstudiante;
      
      // Obtenemos los libros del estudiante
      const librosResponse = await axios.get(`http://127.0.0.1:8000/libros/mis-libros/${idEstudiante}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Filtramos para mostrar solo libros disponibles
      const librosDisponibles = librosResponse.data.filter(libro => 
        libro.estado === "Disponible"
      );
      
      setMisLibros(librosDisponibles);
    } catch (error) {
      console.error('Error al cargar libros:', error);
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
    
    if (!lugarEncuentro) {
      setError('Debes especificar un lugar de encuentro');
      return;
    }
    
    if (!fechaEncuentro || !horaEncuentro) {
      setError('Debes especificar fecha y hora de encuentro');
      return;
    }
    
    try {
      setEnviando(true);
      const token = localStorage.getItem('token');
      
      // Crear fecha y hora en formato ISO
      const fechaHoraEncuentro = new Date(`${fechaEncuentro}T${horaEncuentro}`);
      
      const data = {
        libroOfrecido: libroSeleccionado.idLibro,
        libroSolicitado: libroSolicitado.idLibro,
        lugarEncuentro,
        fechaEncuentro: fechaHoraEncuentro.toISOString(),
        horaEncuentro: fechaHoraEncuentro.toISOString()
      };
      
      await axios.post('http://127.0.0.1:8000/solicitudes/', data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (onSolicitudEnviada) {
        onSolicitudEnviada();
      }
      
      onClose();
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setError(error.response?.data?.detail || 'Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#722F37] mb-6">Solicitar Intercambio</h2>
          
          {/* Información del libro solicitado */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6 flex items-center">
            <img 
              src={libroSolicitado.fotoLibro} 
              alt={libroSolicitado.titulo}
              className="w-16 h-20 object-cover rounded mr-4"
            />
            <div>
              <h3 className="font-semibold">Solicitando: {libroSolicitado.titulo}</h3>
              <p className="text-sm text-gray-600">Autor: {libroSolicitado.autor}</p>
              <p className="text-sm text-gray-600">Propietario: {libroSolicitado.usuarioNombre}</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Selección de libro a ofrecer */}
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
            
            {/* Detalles del encuentro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Lugar de encuentro</label>
                <input
                  type="text"
                  value={lugarEncuentro}
                  onChange={(e) => setLugarEncuentro(e.target.value)}
                  placeholder="Ej: Biblioteca central, piso 2"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  required
                />
              </div>
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
            
            {/* Botones de acción */}
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
  );
};

export default SolicitarIntercambioModal;
