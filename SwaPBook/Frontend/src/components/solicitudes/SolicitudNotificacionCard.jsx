import React from "react";

const SolicitudNotificacionCard = ({
  idSolicitud,
  fotoLibro,
  tituloLibro,
  autorLibro,
  categoriaLibro,
  nombreSolicitante,
  fechaSolicitud,
  lugarEncuentro,
  onAceptar,
  onRechazar,
  onVerDetalles,
  onClose // Si existe, se muestra el botón de cerrar
}) => {
  return (
    <div className="relative flex items-stretch">
      {/* Botón cerrar notificación (solo si onClose existe) */}
      {onClose && (
        <button
          onClick={() => onClose(idSolicitud)}
          className="absolute -top-3 -right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition"
          title="Cerrar notificación"
        >
          {/* Ícono SVG de close, centrado y elegante */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Card principal */}
      <div className="flex bg-white shadow-sm border border-gray-200 overflow-hidden h-32 min-h-36 max-h-38 w-full">
        {/* Botones de acción - Izquierda */}
        <div className="w-12 flex flex-col">
          <button
            onClick={() => onAceptar(idSolicitud)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center rounded-tl-lg"
            style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 8 }}
            title="Aceptar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={() => onRechazar(idSolicitud)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-bl-lg"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 8 }}
            title="Rechazar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Foto del libro */}
        <div className="flex items-center w-20 h-full bg-white">
          <img
            src={fotoLibro}
            alt={tituloLibro}
            className="w-full h-full object-cover border-t border-b border-r border-gray-300"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
          />
        </div>

        {/* Información central */}
        <div className="flex-1 flex flex-col justify-center pl-4 pr-2 py-0 min-w-0">
          <h3 className="font-extrabold text-[#722F37] text-base mt-0.2 leading-tight truncate">{tituloLibro}</h3>
          <div className="flex flex-col gap-0.4 text-sm text-gray-800">
            <span><span className="font-semibold">Autor:</span> {autorLibro}</span>
            <span><span className="font-semibold">Solicitante:</span> {nombreSolicitante}</span>
            <span><span className="font-semibold">Fecha:</span> {fechaSolicitud}</span>
            <span><span className="font-semibold">Lugar:</span> {lugarEncuentro}</span>
            <span><span className="font-semibold">Categoría:</span> {categoriaLibro}</span>
          </div>
        </div>

        {/* Botón Ver detalles - Derecha */}
        <button
          onClick={() => onVerDetalles(idSolicitud)}
          className="w-16 bg-Swap-beige text-white rounded-r-lg hover:bg-[#a67c52] transition-colors flex flex-col items-center justify-center h-full p-2 text-sm font-bold"
          style={{ minWidth: 64 }}
          title="Ver detalles"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0zm6 0a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <span className="hidden sm:inline">Ver</span>
        </button>
      </div>
    </div>
  );
};

export default SolicitudNotificacionCard;
