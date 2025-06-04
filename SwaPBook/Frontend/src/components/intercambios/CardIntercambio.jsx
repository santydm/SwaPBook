import React from 'react';

const CardIntercambio = ({ intercambio }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-4xl mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-[#722F37] text-lg mb-2">
            Estado:{" "}
            <span
              className={
                intercambio.estado === "Finalizado"
                  ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                  : intercambio.estado === "Cancelado"
                  ? "bg-red-100 text-red-700 px-2 py-1 rounded"
                  : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
              }
            >
              {intercambio.estado}
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Fecha del encuentro:</strong>{" "}
            {intercambio.fechaEncuentro
              ? new Date(intercambio.fechaEncuentro).toLocaleDateString()
              : "Sin fecha"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Lugar del encuentro:</strong>{" "}
            {intercambio.lugarEncuentro || "No especificado"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Solicitante:</strong>{" "}
            {intercambio.solicitante?.nombre || "Desconocido"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Libro solicitado:</strong>{" "}
            {intercambio.libro_solicitado?.titulo || "Sin título"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Libro ofrecido:</strong>{" "}
            {intercambio.libro_ofrecido?.titulo || "Sin título"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardIntercambio;
