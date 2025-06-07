import React from "react";
import { FiBookOpen, FiUser, FiLayers, FiInfo, FiX, FiRepeat } from "react-icons/fi";

const IntercambioDetalleModal = ({
  intercambio,
  isOpen,
  onClose,
  onFinalizar,
  onCancelar,
  procesando = false
}) => {
  if (!isOpen || !intercambio) return null;

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString();
  const formatHora = (hora) => new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const solicitante = intercambio.estudiante;
  const receptor = intercambio.estudiante_receptor;
  const libroOfrecido = intercambio.libro_ofrecido || {};
  const libroSolicitado = intercambio.libro_solicitado || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 animate-fade-in">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <FiX className="h-7 w-7" />
        </button>

        {/* Encabezado: usuarios */}
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <div className="flex flex-col items-center">
            <img
              src={solicitante?.fotoPerfil 
                ? `http://localhost:8000${solicitante.fotoPerfil}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(solicitante?.nombre || "Usuario")}`}
              alt={solicitante?.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#c1a57b]"
            />
            <div className="text-center">
              <h3 className="font-bold text-[#722F37]">{solicitante?.nombre}</h3>
              <p className="text-xs text-gray-500">{solicitante?.correo}</p>
              <span className="text-xs text-[#b4a07a] font-semibold">Solicitante</span>
            </div>
          </div>
          <div className="mx-4 animate-pulse">
            <FiRepeat className="h-8 w-8 text-Swap-beige" />
          </div>
          <div className="flex flex-col items-center">
            <img
              src={receptor?.fotoPerfil 
                ? `http://localhost:8000${receptor.fotoPerfil}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(receptor?.nombre || "Usuario")}`}
              alt={receptor?.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#c1a57b]"
            />
            <div className="text-center">
              <h3 className="font-bold text-[#722F37]">{receptor?.nombre}</h3>
              <p className="text-xs text-gray-500">{receptor?.correo}</p>
              <span className="text-xs text-[#b4a07a] font-semibold">Receptor</span>
            </div>
          </div>
        </div>

        {/* Sección de intercambio de libros */}
        <div className="relative bg-[#f9f6f2] rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Libro ofrecido */}
          <div className="flex-1 text-center">
            <span className="bg-[#722F37] text-white px-3 py-1 rounded-t-lg inline-block text-sm font-bold shadow-md mb-2">
              Libro Ofrecido
            </span>
            <img
              src={libroOfrecido.foto 
                ? `http://localhost:8000${libroOfrecido.foto}`
                : "https://via.placeholder.com/150x200?text=Libro+ofrecido"}
              alt={libroOfrecido.titulo}
              className="w-full max-w-[150px] h-[200px] object-cover rounded-lg shadow mx-auto mb-2"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-[#722F37] font-bold">
                <FiBookOpen /> {libroOfrecido.titulo}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <FiUser /> {libroOfrecido.autor}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <FiLayers /> {libroOfrecido.categoria?.nombre || "Sin categoría"}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-700 max-h-10 overflow-y-auto">
                <FiInfo /> {libroOfrecido.descripcion}
              </div>
            </div>
          </div>

          {/* Ícono de intercambio */}
          <div className="relative my-4 sm:my-0 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <FiRepeat className="h-7 w-7 text-Swap-beige" />
            </div>
            <span className="text-xs text-[#b4a07a] mt-2 font-bold">Intercambio</span>
          </div>

          {/* Libro solicitado */}
          <div className="flex-1 text-center">
            <span className="bg-[#722F37] text-white px-3 py-1 rounded-t-lg inline-block text-sm font-bold shadow-md mb-2">
              Libro Solicitado
            </span>
            <img
              src={libroSolicitado.foto 
                ? `http://localhost:8000${libroSolicitado.foto}`
                : "https://via.placeholder.com/150x200?text=Libro+solicitado"}
              alt={libroSolicitado.titulo}
              className="w-full max-w-[150px] h-[200px] object-cover rounded-lg shadow mx-auto mb-2"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-[#722F37] font-bold">
                <FiBookOpen /> {libroSolicitado.titulo}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <FiUser /> {libroSolicitado.autor}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <FiLayers /> {libroSolicitado.categoria?.nombre || "Sin categoría"}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-700 max-h-10 overflow-y-auto">
                <FiInfo /> {libroSolicitado.descripcion}
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del intercambio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Detalles del encuentro
            </h4>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📅</span>
              <span className="font-semibold">Fecha:</span> {formatFecha(intercambio.fechaEncuentro)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">⏰</span>
              <span className="font-semibold">Hora:</span> {formatHora(intercambio.horaEncuentro)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📍</span>
              <span className="font-semibold">Lugar:</span> {intercambio.lugarEncuentro}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Estado del intercambio
            </h4>
            <span className={`text-base font-bold ${
              intercambio.estado === "En proceso" ? "text-yellow-600" :
              intercambio.estado === "Finalizado" ? "text-green-600" : "text-red-600"
            }`}>
              {intercambio.estado}
            </span>
          </div>
        </div>

        {/* Acciones */}
        {intercambio.estado === "En proceso" && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              disabled={procesando}
              onClick={() => {
                if (window.confirm("¿Estás seguro de cancelar este intercambio?")) {
                  onCancelar(intercambio.idIntercambio);
                }
              }}
              className={`flex-1 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-colors flex items-center justify-center gap-2 ${
                procesando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiX className="h-5 w-5" />
              {procesando ? 'Procesando...' : 'Cancelar Intercambio'}
            </button>
            <button
              disabled={procesando}
              onClick={() => {
                if (window.confirm("¿Confirmas que el intercambio se realizó exitosamente?")) {
                  onFinalizar(intercambio.idIntercambio);
                }
              }}
              className={`flex-1 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold transition-colors flex items-center justify-center gap-2 ${
                procesando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              {procesando ? 'Procesando...' : 'Marcar como Finalizado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntercambioDetalleModal;
