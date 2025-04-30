import React from "react";

const CardLibro = ({
  usuarioNombre,
  usuarioFoto,
  fechaPublicacion,
  fotoLibro,
  autor,
  estado,
  onVerDetalles,
}) => {
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
          alt="Portada del libro"
          className="h-full object-contain rounded"
        />
      </div>
      {/* Autor y estado */}
      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Autor:</span> {autor}
        </div>
        <div>
          <span className="font-semibold text-[#722F37]">Estado:</span>{" "}
          <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
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