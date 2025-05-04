// src/components/solicitudes/SolicitudNotificacionCard.jsx
import { useEffect, useRef, useState } from 'react';

const SolicitudNotificacionCard = ({
  idSolicitud,
  fotoLibro,
  tituloLibro,
  autorLibro,
  nombreSolicitante,
  fechaSolicitud,
  lugarEncuentro,
  estado,
  onAceptar,
  onRechazar,
  onClose
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-dismiss timer (7 seconds)
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onClose(idSolicitud), 300); // Animation time before removal
    }, 7000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [idSolicitud, onClose]);

  // Handle mouse enter to pause timer
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'paused';
    }
  };

  // Handle mouse leave to resume timer
  const handleMouseLeave = () => {
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'running';
      // Calculate remaining time based on progress bar width
      const progressBar = progressRef.current;
      const remainingTime = (progressBar.offsetWidth / progressBar.parentElement.offsetWidth) * 7000;
      
      timerRef.current = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => onClose(idSolicitud), 300);
      }, remainingTime);
    }
  };

  return (
    <div 
      className={`relative flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 max-w-2xl w-full transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón de cerrar */}
      <button 
        onClick={() => {
          setIsClosing(true);
          setTimeout(() => onClose(idSolicitud), 300);
        }} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Cerrar notificación"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Foto del libro */}
      <img
        src={fotoLibro}
        alt={tituloLibro}
        className="w-16 h-20 object-cover rounded mr-4 flex-shrink-0 border"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = 'https://via.placeholder.com/100x150?text=No+Image';
        }}
      />

      {/* Información de la solicitud */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="font-bold text-[#722F37] text-base">{tituloLibro}</div>
        <div className="text-xs text-gray-600 mb-1">{autorLibro}</div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Solicitante:</span> {nombreSolicitante}
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-semibold">Fecha solicitud:</span> {fechaSolicitud}
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-semibold">Lugar:</span> {lugarEncuentro}
        </div>
        <div className="text-xs mt-1">
          <span className="font-semibold">Estado:</span>{" "}
          <span className={`font-bold ${estado === "Pendiente" ? "text-yellow-600" : estado === "Aceptada" ? "text-green-700" : "text-red-700"}`}>
            {estado}
          </span>
        </div>
      </div>

      {/* Botones acción */}
      {estado === "Pendiente" && (
        <div className="flex flex-col gap-2 ml-4">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-bold"
            onClick={() => onAceptar(idSolicitud)}
          >
            Aceptar
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-bold"
            onClick={() => onRechazar(idSolicitud)}
          >
            Rechazar
          </button>
        </div>
      )}

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 rounded-b-lg overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-green-500 animate-shrink-width"
        />
      </div>
    </div>
  );
};

export default SolicitudNotificacionCard;
