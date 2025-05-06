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
  onClose
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Card principal */}
      <div className="flex bg-[#f9f6f2] shadow-lg border border-gray-200 overflow-hidden h-32 min-h-36 max-h-38 w-full rounded-xl">
        {/* Botones de acción - Izquierda */}
        <div className="w-14 flex flex-col h-full">
          <button
            onClick={() => onAceptar(idSolicitud)}
            className="flex-1 flex items-center justify-center bg-green-100 text-green-700 font-semibold transition-colors rounded-tl-xl hover:bg-green-200 border-b border-green-200"
            style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 12 }}
            title="Aceptar"
          >
            <span className="text-xs font-bold">Aceptar</span>
          </button>
          <button
            onClick={() => onRechazar(idSolicitud)}
            className="flex-1 flex items-center justify-center bg-red-100 text-red-700 font-semibold transition-colors rounded-bl-xl hover:bg-red-200 border-t border-red-200"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 12 }}
            title="Rechazar"
          >
            <span className="text-xs font-bold">Rechazar</span>
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
          <h3 className="font-extrabold text-[#722F37] text-base mb-1 leading-tight truncate">
            {tituloLibro}
          </h3>
          <div className="flex flex-col gap-0.5 text-sm text-gray-800">
            <span>
              <span className="font-semibold">Autor:</span> {autorLibro}
            </span>
            <span>
              <span className="font-semibold">Solicitante:</span> {nombreSolicitante}
            </span>
            <span>
              <span className="font-semibold">Fecha:</span> {fechaSolicitud}
            </span>
            <span>
              <span className="font-semibold">Lugar:</span> {lugarEncuentro}
            </span>
            <span>
              <span className="font-semibold">Categoría:</span> {categoriaLibro}
            </span>
          </div>
        </div>

        {/* Botón Ver detalles - Derecha, color suave y armónico */}
        <button
          onClick={() => onVerDetalles(idSolicitud)}
          className="w-16 h-full bg-gray-200 text-[#722F37] rounded-r-lg hover:bg-gray-300 transition-colors flex flex-col items-center justify-center p-2 text-sm font-bold"
          style={{ minWidth: 64 }}
          title="Ver detalles"
        >
          <span className="text-base font-bold">Ver</span>
        </button>
      </div>
    </div>
  );
};

export default SolicitudNotificacionCard;
