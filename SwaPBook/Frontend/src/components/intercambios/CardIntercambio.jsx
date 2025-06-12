import { FiBookOpen, FiUser, FiLayers, FiClock } from "react-icons/fi";

// Card compacta para mostrar un intercambio en el admin
const CardIntercambio = ({ intercambio, classNameAdmin }) => {
  // Formateadores de fecha y hora
  const formatFecha = (fecha) =>
    fecha ? new Date(fecha).toLocaleDateString("es-ES") : "Sin fecha";
  const formatHora = (fecha) =>
    fecha ? new Date(fecha).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div
      className={`bg-white rounded-xl shadow border border-gray-200 flex flex-col justify-between transition-transform hover:scale-105 mb-4 w-full ${classNameAdmin || ""}`}
      style={{ minWidth: 210, maxWidth: 260, height: 270 }}
    >
      {/* Encabezado: Estado y fecha cambio */}
      <div className="bg-[#722F37] px-3 py-2 flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
          intercambio.estado === "finalizado"
            ? "bg-green-100 text-green-700"
            : intercambio.estado === "cancelado"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {intercambio.estado.charAt(0).toUpperCase() + intercambio.estado.slice(1)}
        </span>
        <span className="text-white/90 text-xs flex items-center gap-1">
          <FiClock /> {formatFecha(intercambio.fechaCambioEstado)}
        </span>
      </div>

      {/* Libros y nombres */}
      <div className="flex flex-row gap-1 items-center justify-center py-2 px-2">
        {/* Libro solicitado */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={intercambio.libro_solicitado?.foto 
              ? `http://localhost:8000${intercambio.libro_solicitado.foto}`
              : "/images/book-placeholder.png"}
            alt={intercambio.libro_solicitado?.titulo}
            className="w-12 h-16 object-cover rounded border"
          />
          <div className="text-[10px] text-[#722F37] font-bold text-center truncate w-16">
            {intercambio.libro_solicitado?.titulo}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-1">
          <span className="text-[#c1a57b] font-bold text-base">⇄</span>
        </div>
        {/* Libro ofrecido */}
        <div className="flex flex-col items-center flex-1">
          <img
            src={intercambio.libro_ofrecido?.foto 
              ? `http://localhost:8000${intercambio.libro_ofrecido.foto}`
              : "/images/book-placeholder.png"}
            alt={intercambio.libro_ofrecido?.titulo}
            className="w-12 h-16 object-cover rounded border"
          />
          <div className="text-[10px] text-[#722F37] font-bold text-center truncate w-16">
            {intercambio.libro_ofrecido?.titulo}
          </div>
        </div>
      </div>

      {/* Nombres y detalles compactos */}
      <div className="px-3 pb-2 flex flex-col gap-0.5 text-[11px] text-gray-700">
        <div className="flex items-center gap-1">
          <FiUser className="text-Swap-beige" />
          <span className="font-semibold text-[#722F37]">S:</span>
          <span className="truncate">{intercambio.estudiante?.nombre || "Desconocido"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiUser className="text-Swap-beige" />
          <span className="font-semibold text-[#722F37]">R:</span>
          <span className="truncate">{intercambio.estudiante_receptor?.nombre || "Desconocido"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiLayers className="text-Swap-beige" />
          <span className="truncate">{intercambio.lugarEncuentro || "Sin lugar"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiClock className="text-Swap-beige" />
          <span>
            {formatFecha(intercambio.fechaEncuentro)} {formatHora(intercambio.horaEncuentro)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardIntercambio;
