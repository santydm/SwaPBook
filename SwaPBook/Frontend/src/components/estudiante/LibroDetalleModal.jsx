// src/components/estudiante/LibroDetalleModal.jsx
import React from "react";

const LibroDetalleModal = ({ 
  libro, 
  isOpen, 
  onClose, 
  esPropio, 
  onSolicitarIntercambio,
  onEditarLibro,
  onEliminarLibro
}) => {
  if (!isOpen || !libro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Contenido del modal */}
        <div className="flex flex-col md:flex-row">
          {/* Imagen del libro - Lado izquierdo */}
          <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center md:rounded-l-lg">
            <img
              src={libro.fotoLibro}
              alt={libro.titulo}
              className="max-h-96 object-contain rounded-md shadow-md"
            />
          </div>
          
          {/* Detalles del libro - Lado derecho */}
          <div className="md:w-2/3 p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* Información del libro */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#722F37] mb-2">{libro.titulo}</h2>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <img
                    src={libro.usuarioFoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(libro.usuarioNombre || 'Usuario')}&background=722F37&color=fff&size=36`}
                    alt="Usuario"
                    className="w-8 h-8 rounded-full mr-2 border-2 border-[#722F37]"
                  />
                  <span className="text-gray-700">Publicado por <span className="font-semibold">{libro.usuarioNombre}</span></span>
                </div>
                <span className="text-sm text-gray-500 ml-10">{libro.fechaPublicacion}</span>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                <div>
                  <span className="font-semibold text-[#722F37]">Autor:</span> {libro.autor}
                </div>
                <div>
                  <span className="font-semibold text-[#722F37]">Categoría:</span> {libro.categoria}
                </div>
                <div>
                  <span className="font-semibold text-[#722F37]">Estado:</span>
                  <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs rounded font-semibold ${
                    libro.estado === "Disponible" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                  }`}>
                    {libro.estado === "Disponible" && (
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="10" />
                      </svg>
                    )}
                    {libro.estado}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#722F37] block mb-1">Descripción:</span>
                  <p className="text-gray-700 text-sm">{libro.descripcion}</p>
                </div>
              </div>
            </div>
            
            {/* Acciones - Lado derecho */}
            <div className="w-full md:w-44 flex flex-col space-y-4">
              {esPropio ? (
                // Acciones para libros propios
                <>
                  <button 
                    onClick={() => onEditarLibro(libro)}
                    className="w-full py-3 bg-Swap-beige text-white rounded-md font-semibold hover:bg-[#a67c52] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar libro
                  </button>
                  
                  <button 
                    onClick={() => onEliminarLibro(libro.idLibro)}
                    className="w-full py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar libro
                  </button>
                </>
              ) : (
                // Acciones para libros de otros usuarios
                <button 
                  onClick={() => onSolicitarIntercambio(libro)}
                  className="w-full py-3 bg-Swap-green text-white rounded-md font-semibold hover:bg-Swap-green-dark transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Solicitar intercambio
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibroDetalleModal;
