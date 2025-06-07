import React from "react";

const IntercambioDetalleModal = ({
  intercambio,
  isOpen,
  onClose,
  onFinalizar,
  onCancelar,
  procesando = false
}) => {
  if (!isOpen || !intercambio) return null;

  const formatFecha = (fecha) => new Date(fecha).toLocaleDateString();
  const formatHora = (hora) => new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const solicitante = intercambio.estudiante;
  const receptor = intercambio.estudiante_receptor;
  const libroOfrecido = intercambio.libro_ofrecido || {};
  const libroSolicitado = intercambio.libro_solicitado || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 animate-fade-in">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <img
            src={solicitante?.fotoPerfil 
              ? `http://localhost:8000${solicitante.fotoPerfil}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(solicitante?.nombre || "Usuario")}`}
            alt={solicitante?.nombre}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#c1a57b]"
          />
          <div>
            <h3 className="font-bold text-[#722F37]">{solicitante?.nombre}</h3>
            <p className="text-xs text-gray-500">{solicitante?.correo}</p>
            <span className="text-xs text-[#b4a07a] font-semibold">Solicitante</span>
          </div>
          <div className="mx-4 animate-pulse">
            <svg className="h-8 w-8 text-Swap-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <img
            src={receptor?.fotoPerfil 
              ? `http://localhost:8000${receptor.fotoPerfil}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(receptor?.nombre || "Usuario")}`}
            alt={receptor?.nombre}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#c1a57b]"
          />
          <div>
            <h3 className="font-bold text-[#722F37]">{receptor?.nombre}</h3>
            <p className="text-xs text-gray-500">{receptor?.correo}</p>
            <span className="text-xs text-[#b4a07a] font-semibold">Receptor</span>
          </div>
        </div>

        {/* Sección de intercambio de libros */}
        <div className="relative bg-[#f9f6f2] rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Libro ofrecido */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              <span className="bg-[#722F37] text-white px-3 py-1 rounded-t-lg inline-block text-sm font-bold shadow-md">
                Libro Ofrecido
              </span>
            </div>
            <img
              src={libroOfrecido.foto 
                ? `http://localhost:8000${libroOfrecido.foto}`
                : "https://via.placeholder.com/150x200?text=Libro+ofrecido"}
              alt={libroOfrecido.titulo}
              className="w-full max-w-[150px] h-[200px] object-cover rounded-lg shadow mx-auto mb-3"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-[#722F37]">{libroOfrecido.titulo}</h4>
              <p className="text-sm text-gray-600">{libroOfrecido.autor}</p>
              <span className="inline-block bg-Swap-beige text-white px-2 py-0.5 rounded text-xs">
                {libroOfrecido.categoria?.nombre || "Sin categoría"}
              </span>
            </div>
          </div>

          {/* Animación de intercambio */}
          <div className="relative my-4 sm:my-0 flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 text-Swap-beige" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <span className="text-xs text-[#b4a07a] mt-2 font-bold">Intercambio</span>
          </div>

          {/* Libro solicitado */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              <span className="bg-[#722F37] text-white px-3 py-1 rounded-t-lg inline-block text-sm font-bold shadow-md">
                Libro Solicitado
              </span>
            </div>
            <img
              src={libroSolicitado.foto 
                ? `http://localhost:8000${libroSolicitado.foto}`
                : "https://via.placeholder.com/150x200?text=Libro+solicitado"}
              alt={libroSolicitado.titulo}
              className="w-full max-w-[150px] h-[200px] object-cover rounded-lg shadow mx-auto mb-3"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-[#722F37]">{libroSolicitado.titulo}</h4>
              <p className="text-sm text-gray-600">{libroSolicitado.autor}</p>
              <span className="inline-block bg-Swap-beige text-white px-2 py-0.5 rounded text-xs">
                {libroSolicitado.categoria?.nombre || "Sin categoría"}
              </span>
            </div>
          </div>
        </div>

        {/* Detalles del intercambio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Detalles del encuentro
            </h4>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📅</span>
              <span className="font-semibold">Fecha:</span> {formatFecha(intercambio.fechaEncuentro)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">⏰</span>
              <span className="font-semibold">Hora:</span> {formatHora(intercambio.horaEncuentro)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-Swap-beige">📍</span>
              <span className="font-semibold">Lugar:</span> {intercambio.lugarEncuentro}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#722F37] mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Estado del intercambio
            </h4>
            <span className={`text-base font-bold ${
              intercambio.estado === "En proceso" ? "text-yellow-600" :
              intercambio.estado === "Finalizado" ? "text-green-600" : "text-red-600"
            }`}>
              {intercambio.estado}
            </span>
          </div>
        </div>

        {/* Acciones */}
        {intercambio.estado === "En proceso" && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              disabled={procesando}
              onClick={() => {
                if (window.confirm("¿Estás seguro de cancelar este intercambio?")) {
                  onCancelar(intercambio.idIntercambio);
                }
              }}
              className={`flex-1 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-colors flex items-center justify-center gap-2 ${
                procesando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {procesando ? 'Procesando...' : 'Cancelar Intercambio'}
            </button>
            <button
              disabled={procesando}
              onClick={() => {
                if (window.confirm("¿Confirmas que el intercambio se realizó exitosamente?")) {
                  onFinalizar(intercambio.idIntercambio);
                }
              }}
              className={`flex-1 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold transition-colors flex items-center justify-center gap-2 ${
                procesando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              {procesando ? 'Procesando...' : 'Marcar como Finalizado'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntercambioDetalleModal;
