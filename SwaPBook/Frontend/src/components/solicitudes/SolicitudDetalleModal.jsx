// src/components/solicitudes/SolicitudDetalleModal.jsx
import React from "react";

const SolicitudDetalleModal = ({
  solicitud,
  isOpen,
  onClose,
  onAceptar,
  onRechazar
}) => {
  if (!isOpen || !solicitud) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#722F37] mb-4">Detalles de la Solicitud</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Libro solicitado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Libro Solicitado</h3>
            <img
              src={`http://localhost:8000${solicitud.libro_solicitado?.foto}`}
              alt={solicitud.libro_solicitado?.titulo}
              className="h-40 w-full object-contain mb-2"
            />
            <p className="font-medium">{solicitud.libro_solicitado?.titulo}</p>
            <p className="text-sm text-gray-600">{solicitud.libro_solicitado?.autor}</p>
          </div>

          {/* Libro ofrecido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Libro Ofrecido</h3>
            <img
              src={`http://localhost:8000${solicitud.libro_ofrecido?.foto}`}
              alt={solicitud.libro_ofrecido?.titulo}
              className="h-40 w-full object-contain mb-2"
            />
            <p className="font-medium">{solicitud.libro_ofrecido?.titulo}</p>
            <p className="text-sm text-gray-600">{solicitud.libro_ofrecido?.autor}</p>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="mt-4 space-y-2">
          <p><span className="font-semibold">Solicitante:</span> {solicitud.solicitante?.nombre}</p>
          <p><span className="font-semibold">Fecha de encuentro:</span> {new Date(solicitud.fechaEncuentro).toLocaleDateString()}</p>
          <p><span className="font-semibold">Lugar:</span> {solicitud.lugarEncuentro}</p>
          <p><span className="font-semibold">Estado:</span> <span className={`${solicitud.estado === "Pendiente" ? "text-yellow-600" : solicitud.estado === "Aceptada" ? "text-green-600" : "text-red-600"}`}>{solicitud.estado}</span></p>
        </div>

        {/* Acciones */}
        {solicitud.estado === "Pendiente" && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => onRechazar(solicitud.idSolicitud)}
              className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Rechazar
            </button>
            <button
              onClick={() => onAceptar(solicitud.idSolicitud)}
              className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudDetalleModal;
