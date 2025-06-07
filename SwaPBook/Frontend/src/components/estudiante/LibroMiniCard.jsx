const LibroMiniCard = ({ libro, seleccionado, onClick, disabled }) => {
  const descripcion = libro?.descripcion || "Sin descripción";
  
  return (
    <div 
      className={`bg-white rounded-lg border-2 border-gray-200 p-3 flex flex-col w-48 min-h-[200px] cursor-pointer transition-all
        ${seleccionado ? "border-Swap-beige ring-2 ring-Swap-beige" : "hover:border-Swap-beige"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onClick}
    >
      <img
        src={libro?.foto ? (libro.foto.startsWith("http") ? libro.foto : `http://localhost:8000${libro.foto}`) : "/images/book-placeholder.png"}
        alt={libro?.titulo || "Libro"}
        className="w-full h-32 object-cover rounded mb-2"
      />
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-[#722F37] text-sm truncate mb-1">
          {libro?.titulo || "Sin título"}
        </h3>
        <p className="text-xs text-gray-600 truncate mb-1">
          {libro?.autor || "Autor desconocido"}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {libro?.categoria?.nombre || "Sin categoría"}
        </p>
        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default LibroMiniCard;
