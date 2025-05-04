// src/components/solicitudes/SolicitudNotificacionCard.jsx
import React from "react";

const SolicitudNotificacionCard = ({
  idSolicitud,
  fotoLibro,
  tituloLibro,
  autorLibro,
  nombreSolicitante,
  fechaSolicitud,
  lugarEncuentro,
  estado,
  onAceptar,
  onRechazar,
  onVerDetalles
}) => {
  return (
    <div className="flex items-stretch bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Botón de detalles */}
      <button
        onClick={() => onVerDetalles(idSolicitud)}
        className="bg-Swap-beige text-white px-4 rounded-l-lg hover:bg-[#a67c52] transition-colors flex items-center justify-center"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        Ver detalles
      </button>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center p-4">
        <img
          src={fotoLibro}
          alt={tituloLibro}
          className="w-16 h-20 object-cover rounded mr-4 border"
        />

        <div className="flex-1">
          <h3 className="font-bold text-[#722F37]">{tituloLibro}</h3>
          <p className="text-sm text-gray-600">{autorLibro}</p>
          <div className="mt-2 text-sm">
            <p><span className="font-semibold">Solicitante:</span> {nombreSolicitante}</p>
            <p><span className="font-semibold">Fecha:</span> {fechaSolicitud}</p>
            <p><span className="font-semibold">Lugar:</span> {lugarEncuentro}</p>
          </div>
        </div>

        {/* Estado y acciones */}
        <div className="ml-4 text-center">
          <span className={`text-sm font-semibold ${
            estado === "Pendiente" ? "text-yellow-600" :
            estado === "Aceptada" ? "text-green-600" : "text-red-600"
          }`}>
            {estado}
          </span>
          
          {estado === "Pendiente" && (
            <div className="mt-2 space-y-2">
              <button
                onClick={() => onAceptar(idSolicitud)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Aceptar
              </button>
              <button
                onClick={() => onRechazar(idSolicitud)}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolicitudNotificacionCard;
