import React from "react";
import {
  FiBookOpen,
  FiUser,
  FiTag,
  FiLayers,
  FiCheckCircle,
  FiInfo,
  FiEye
} from "react-icons/fi";

const CardLibro = ({
  usuarioNombre,
  usuarioFoto,
  fechaPublicacion,
  fotoLibro,
  titulo,
  autor,
  categoria,
  descripcion,
  estado,
  onVerDetalles,
}) => {
  const estadoDisponible = estado === "Disponible";

  // Fallback para imágenes rotas
  const handleImgError = (e, tipo) => {
    if (tipo === "usuario") {
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        usuarioNombre || "Usuario"
      )}&background=722F37&color=fff&size=64`;
    } else {
      e.target.src = "/images/book-placeholder.png";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col overflow-hidden w-full min-w-[280px] max-w-md hover:shadow-lg transition-shadow duration-200">
      {/* Header usuario */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50">
        <img
          src={
            usuarioFoto
              ? usuarioFoto.startsWith("http")
                ? usuarioFoto
                : `http://localhost:8000${usuarioFoto}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  usuarioNombre || "Usuario"
                )}&background=722F37&color=fff&size=64`
          }
          alt="Usuario"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#722F37] bg-white"
          onError={e => handleImgError(e, "usuario")}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#722F37] text-base truncate">{usuarioNombre}</div>
          <div className="text-xs text-gray-500 truncate">{fechaPublicacion}</div>
        </div>
      </div>
      {/* Imagen del libro */}
      <div className="flex justify-center items-center bg-gray-100 h-56">
        <img
          src={fotoLibro}
          alt={titulo}
          className="h-full object-contain rounded"
          onError={e => handleImgError(e, "libro")}
        />
      </div>
      {/* Información del libro */}
      <div className="px-6 py-4 flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <FiBookOpen className="text-Swap-beige" />
          <h3 className="font-extrabold text-lg text-[#722F37] truncate">{titulo}</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FiUser className="text-Swap-beige" />
          <span className="font-semibold">Autor:</span>
          <span className="truncate">{autor}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FiLayers className="text-Swap-beige" />
          <span className="font-semibold">Categoría:</span>
          <span className="truncate">{categoria}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <FiInfo className="text-Swap-beige" />
          <span className="font-semibold">Descripción:</span>
        </div>
        <div
          className="text-gray-600 text-xs mt-1 mb-1 line-clamp-2 cursor-help"
          title={descripcion}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "2.5em",
            maxHeight: "2.5em",
          }}
        >
          {descripcion}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <FiTag className="text-Swap-beige" />
          <span className="font-semibold text-[#722F37]">Estado:</span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-semibold ${
              estadoDisponible
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {estadoDisponible && (
              <FiCheckCircle className="w-3 h-3 text-green-600" />
            )}
            {estado}
          </span>
        </div>
      </div>
      {/* Botón ver detalles */}
      <div className="p-6 pt-2">
        <button
          onClick={onVerDetalles}
          className="w-full py-2 bg-[#722F37] text-white rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-Swap-beige hover:text-white transition-colors"
        >
          <FiEye className="inline-block" />
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardLibro;
