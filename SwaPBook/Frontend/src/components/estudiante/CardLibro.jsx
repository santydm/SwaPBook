// src/components/estudiante/CardLibro.jsx
import React from "react";

const CardLibro = ({
  usuarioNombre,
  usuarioFoto,
  fechaPublicacion,
  fotoLibro,
  titulo,
  autor,
  categoria,
  estado,
  onVerDetalles,
}) => {
  // Indicador de estado
  const estadoDisponible = estado === "Disponible";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden w-full max-w-xs">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <img
          src={
            usuarioFoto ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioNombre || "Usuario")}&background=722F37&color=fff&size=64`
          }
          alt="Usuario"
          className="w-8 h-8 rounded-full object-cover border-2 border-[#722F37]"
        />
        <div className="flex-1">
          <div className="font-semibold text-[#722F37] text-sm">{usuarioNombre}</div>
          <div className="text-xs text-gray-500">{fechaPublicacion}</div>
        </div>
      </div>
      {/* Imagen del libro */}
      <div className="flex justify-center items-center bg-gray-100 h-40">
        <img
          src={fotoLibro}
          alt={titulo}
          className="h-full object-contain rounded"
        />
      </div>
      {/* Información del libro */}
      <div className="px-4 py-3 flex flex-col gap-1 flex-1">
        <h3 className="font-extrabold text-lg text-[#722F37] mb-1">{titulo}</h3>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Autor:</span> {autor}
        </div>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Categoría:</span> {categoria}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-[#722F37]">Estado:</span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-semibold ${
              estadoDisponible
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {estadoDisponible && (
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="10" />
              </svg>
            )}
            {estado}
          </span>
        </div>
      </div>
      {/* Botón ver detalles */}
      <div className="p-4 pt-2">
        <button
          onClick={onVerDetalles}
          className="w-full py-2 bg-Swap-beige text-white rounded-md font-semibold hover:bg-[#a67c52] transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default CardLibro;
