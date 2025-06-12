// src/components/intercambio/BookPreviewCard.jsx
import React from "react";

const BookPreviewCard = ({ titulo, libro = {}, placeholder }) => (
  <div className="flex flex-col items-center bg-white rounded-lg shadow-md border-2 border-green-500 p-4 w-56 min-h-[320px]">
    <span className="text-xs font-semibold text-[#722F37] mb-2 uppercase tracking-wider">{titulo}</span>
    <img
      src={libro?.foto ? (libro.foto.startsWith("http") ? libro.foto : `http://localhost:8000${libro.foto}`) : "/images/book-placeholder.png"}
      alt={libro?.titulo || "Libro"}
      className="w-24 h-32 object-cover rounded mb-2 border"
    />
    <div className="text-center flex-1 flex flex-col">
      <p className="font-bold text-[#722F37] text-base truncate">{libro?.titulo || placeholder || "Sin título"}</p>
      <p className="text-sm text-gray-700">{libro?.autor || "Autor desconocido"}</p>
      <p className="text-xs text-gray-500">{libro?.categoria?.nombre || libro?.categoria || "Sin categoría"}</p>
      <p className="text-xs text-gray-600 mt-2 line-clamp-3">{libro?.descripcion || "Sin descripción"}</p>
    </div>
  </div>
);

export default BookPreviewCard;
