// src/components/estudiante/LibroMiniCard.jsx
const LibroMiniCard = ({
    libro,
    seleccionado,
    onClick
  }) => {
    const estadoDisponible = libro.estado === "Disponible";
    return (
      <div
        className={`border rounded-lg p-3 cursor-pointer transition-all flex flex-col gap-2
          ${seleccionado ? 'border-green-500 bg-green-50 ring-2 ring-green-500' : 'border-gray-200 hover:border-gray-400'}
          shadow-sm hover:shadow-md`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <img
            src={`http://localhost:8000${libro.foto}`}
            alt={libro.titulo}
            className="w-16 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h4 className="font-bold text-[#722F37] text-base">{libro.titulo}</h4>
            <p className="text-xs text-gray-700"><span className="font-semibold">Autor:</span> {libro.autor}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-semibold text-[#722F37] text-xs">Estado:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded font-semibold ${
                estadoDisponible ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
              }`}>
                {estadoDisponible && (
                  <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" />
                  </svg>
                )}
                {libro.estado}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1 line-clamp-2 hover:line-clamp-none">
          <span className="font-semibold">Descripción:</span> {libro.descripcion}
        </div>
      </div>
    );
  };
  
  export default LibroMiniCard;
  