import React from "react";
import { FiBookOpen, FiUser, FiInfo, FiLayers, FiX } from "react-icons/fi";

const SolicitudDetalleModal = ({
  solicitud,
  isOpen,
  onClose,
  onAceptar,
  onRechazar,
}) => {
  if (!isOpen || !solicitud) return null;

  // Datos del solicitante y libros
  const perfilSolicitante = solicitud.solicitante || {};
  const libroSolicitado = solicitud.libro_solicitado || {};
  const libroOfrecido = solicitud.libro_ofrecido || {};

  // Fechas
  const fecha = solicitud.fechaEncuentro ? new Date(solicitud.fechaEncuentro) : null;
  const fechaStr = fecha?.toLocaleDateString() || "";
  const horaStr = fecha?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6">
        {/* Barra superior */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={perfilSolicitante.fotoPerfil 
                ? `http://localhost:8000${perfilSolicitante.fotoPerfil}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(perfilSolicitante.nombre || "Usuario")}`}
              alt={perfilSolicitante.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#c1a57b]"
            />
            <div>
              <h3 className="font-bold text-[#722F37]">{perfilSolicitante.nombre}</h3>
              <p className="text-xs text-gray-500">{perfilSolicitante.correo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Cerrar"
          >
            <FiX />
          </button>
        </div>

        {/* Sección de intercambio de libros */}
        <div className="relative bg-[#f9f6f2] rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
                <div className="flex items-center justify-center gap-2 text-xs text-gray-700 max-h-12 overflow-y-auto">
                  <FiInfo /> {libroSolicitado.descripcion}
                </div>
              </div>
            </div>

            {/* Ícono de intercambio */}
            <div className="relative my-4 sm:my-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-Swap-beige" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
            </div>

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
                <div className="flex items-center justify-center gap-2 text-xs text-gray-700 max-h-12 overflow-y-auto">
                  <FiInfo /> {libroOfrecido.descripcion}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del encuentro y estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Detalles del intercambio
            </h4>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📅</span>
              <span className="font-semibold">Fecha:</span> {fechaStr}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">⏰</span>
              <span className="font-semibold">Hora:</span> {horaStr}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📍</span>
              <span className="font-semibold">Lugar:</span> {solicitud.lugarEncuentro}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Estado de la solicitud
            </h4>
            <span className={`text-sm font-bold ${
              solicitud.estado === "Pendiente" ? "text-yellow-600" :
              solicitud.estado === "Aceptada" ? "text-green-600" : "text-red-600"
            }`}>
              {solicitud.estado}
            </span>
          </div>
        </div>

        {/* Acciones */}
        {solicitud.estado === "Pendiente" && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => onRechazar(solicitud.idSolicitud)}
              className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FiX className="h-5 w-5" />
              Rechazar
            </button>
            <button
              onClick={() => onAceptar(solicitud.idSolicitud)}
              className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Aceptar Intercambio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudDetalleModal;
