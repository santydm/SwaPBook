import React, { useEffect } from "react";
import { FiCheck, FiX, FiInfo, FiUser, FiCalendar, FiMapPin, FiBook } from "react-icons/fi";

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
  onClose,
  animated = true, // por defecto animada
  wide = false,    // por defecto compacta
  autoClose = false, // solo para notificaciones
  autoCloseTime = 5000 // ms
}) => {
  // Manejo seguro de la imagen
  const getFotoUrl = (foto) => {
    if (!foto || foto.trim() === "") return "/images/book-placeholder.png";
    if (foto.startsWith("http")) return foto;
    return `http://localhost:8000${foto}`;
  };

  // Descartar automáticamente tras X segundos (solo si autoClose)
  useEffect(() => {
    if (!autoClose || !onClose) return;
    const timer = setTimeout(() => onClose(idSolicitud), autoCloseTime);
    return () => clearTimeout(timer);
  }, [autoClose, autoCloseTime, idSolicitud, onClose]);

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-lg border border-gray-200 flex
        ${wide ? "w-[520px] min-h-[160px]" : "w-[410px] min-h-[144px]"}
        ${animated ? "animate-slide-in" : ""}
      `}
    >
      {/* Botones de acción */}
      <div className="flex flex-col justify-center items-center px-2 gap-2">
        <button
          onClick={() => onAceptar(idSolicitud)}
          className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
          title="Aceptar solicitud"
        >
          <FiCheck className="w-5 h-5" />
        </button>
        <button
          onClick={() => onRechazar(idSolicitud)}
          className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
          title="Rechazar solicitud"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Foto grande del libro */}
      <div className="flex items-center justify-center p-3">
        <img
          src={getFotoUrl(fotoLibro)}
          alt={tituloLibro}
          className={`${wide ? "w-28 h-36" : "w-24 h-32"} object-cover rounded-lg border-2 border-Swap-beige`}
        />
      </div>

      {/* Información */}
      <div className="flex-1 flex flex-col justify-between py-3 pl-3 pr-2 min-w-0">
        <div>
          <h3 className="font-semibold text-[#722F37] text-lg truncate">{tituloLibro}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
            <FiBook className="flex-shrink-0" />
            <span className="truncate">{autorLibro}</span>
            <span className="inline-block ml-2 px-2 py-0.5 bg-[#f9f6f2] text-[#722F37] text-xs rounded-full">
              {categoriaLibro}
            </span>
          </div>
        </div>
        <div className="space-y-1.5 text-sm mt-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FiUser className="text-[#722F37]" />
            <span className="truncate">{nombreSolicitante}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiCalendar className="text-[#722F37]" />
            <span>{fechaSolicitud}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="text-[#722F37]" />
            <span className="truncate">{lugarEncuentro}</span>
          </div>
        </div>
      </div>

      {/* Botón cerrar y detalles */}
      <div className="flex flex-col justify-between items-end py-2 pr-2">
        {onClose && (
          <button
            onClick={() => onClose(idSolicitud)}
            className="p-1 text-gray-400 hover:text-[#722F37] transition"
            title="Cerrar notificación"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onVerDetalles(idSolicitud)}
          className="p-1 text-[#722F37] hover:text-[#a67c52] transition"
          title="Ver detalles"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SolicitudNotificacionCard;
