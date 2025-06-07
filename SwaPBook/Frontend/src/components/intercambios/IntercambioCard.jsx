import React from "react";

const estadoStyles = {
  "En proceso": "bg-orange-100 text-orange-700",
  "Finalizado": "bg-green-100 text-green-700",
  "Cancelado": "bg-red-100 text-red-700"
};

const IntercambioCard = ({ intercambio, onVerDetalles }) => {
  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString();
  const formatHora = (hora) => new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Columna izquierda - Estado y Solicitante */}
      <div className="w-24 flex flex-col items-center bg-gray-50 p-3 border-r border-gray-200">
        {/* Estado */}
        <span className={`w-full text-center px-2 py-1 rounded text-sm font-semibold mb-3 ${
          estadoStyles[intercambio.estado] || "bg-gray-100 text-gray-700"
        }`}>
          {intercambio.estado}
        </span>

        {/* Foto y nombre del solicitante */}
        <div className="flex flex-col items-center">
          <img
            src={
              intercambio.estudiante?.fotoPerfil 
                ? `http://localhost:8000${intercambio.estudiante.fotoPerfil}`
                : `https://ui-avatars.com/api/?name=${intercambio.estudiante?.nombre || "U"}`
            }
            alt={intercambio.estudiante?.nombre}
            className="w-10 h-10 rounded-full object-cover border-2 border-Swap-beige mb-1"
          />
          <span className="text-xs text-center font-medium text-[#722F37]">
            {intercambio.estudiante?.nombre || "N/A"}
          </span>
          <span className="text-[10px] text-gray-500 mt-1">Solicitante</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center p-4 gap-4">
        {/* Libro ofrecido */}
        <div className="flex flex-col items-center w-20">
          <img
            src={`http://localhost:8000${intercambio.libro_ofrecido?.foto}`}
            alt={intercambio.libro_ofrecido?.titulo}
            className="w-16 h-24 object-cover rounded-lg border shadow"
          />
          <span className="text-xs text-center mt-1 font-semibold text-[#722F37] truncate w-full">
            {intercambio.libro_ofrecido?.titulo}
          </span>
        </div>

        {/* Icono de intercambio */}
        <div className="text-2xl text-Swap-beige mx-2">⇄</div>

        {/* Libro solicitado */}
        <div className="flex flex-col items-center w-20">
          <img
            src={`http://localhost:8000${intercambio.libro_solicitado?.foto}`}
            alt={intercambio.libro_solicitado?.titulo}
            className="w-16 h-24 object-cover rounded-lg border shadow"
          />
          <span className="text-xs text-center mt-1 font-semibold text-[#722F37] truncate w-full">
            {intercambio.libro_solicitado?.titulo}
          </span>
        </div>

        {/* Detalles del encuentro */}
        <div className="ml-4 flex-1">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-Swap-beige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{formatFecha(intercambio.fechaEncuentro)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-Swap-beige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{formatHora(intercambio.horaEncuentro)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-Swap-beige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 0l-4.243 4.243a8 8 0 1111.314 0z"/>
              </svg>
              <span className="truncate">{intercambio.lugarEncuentro}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Ver detalles */}
      <button
        onClick={onVerDetalles}
        className="w-16 bg-Swap-beige text-white flex flex-col items-center justify-center hover:bg-[#a67c52] transition-colors"
      >
        <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        <span className="text-xs font-medium">Detalles</span>
      </button>
    </div>
  );
};

export default IntercambioCard;
