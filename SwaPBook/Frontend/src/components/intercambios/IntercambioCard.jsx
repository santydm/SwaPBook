import React from "react";

const IntercambioCard = ({ intercambio, onVerDetalles }) => {
  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString();
  const formatHora = (hora) => new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Botones de estado */}
      <div className="w-14 flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center bg-green-100 text-green-700 font-bold text-sm">
          {intercambio.estado}
        </div>
      </div>

      {/* Libros involucrados */}
      <div className="flex-1 flex items-center p-4 gap-4">
        {/* Libro ofrecido */}
        <div className="flex flex-col items-center w-20">
          <img
            src={`http://localhost:8000${intercambio.libro_ofrecido?.foto}`}
            alt={intercambio.libro_ofrecido?.titulo}
            className="w-16 h-24 object-cover rounded-lg border"
          />
          <span className="text-xs text-center mt-1 font-semibold text-[#722F37]">
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
            className="w-16 h-24 object-cover rounded-lg border"
          />
          <span className="text-xs text-center mt-1 font-semibold text-[#722F37]">
            {intercambio.libro_solicitado?.titulo}
          </span>
        </div>

        {/* Detalles rápidos */}
        <div className="ml-4 flex-1">
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">Fecha:</span> {formatFecha(intercambio.fechaEncuentro)}</p>
            <p><span className="font-semibold">Hora:</span> {formatHora(intercambio.horaEncuentro)}</p>
            <p><span className="font-semibold">Lugar:</span> {intercambio.lugarEncuentro}</p>
          </div>
        </div>
      </div>

      {/* Botón Ver detalles */}
      <button
        onClick={onVerDetalles}
        className="w-14 bg-Swap-beige text-white flex items-center justify-center hover:bg-[#a67c52] transition-colors"
      >
        <span className="rotate-90 text-sm font-bold">Ver</span>
      </button>
    </div>
  );
};

export default IntercambioCard;
