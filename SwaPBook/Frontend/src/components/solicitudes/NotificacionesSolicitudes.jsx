import { useEffect, useState } from "react";
import SolicitudNotificacionCard from "./SolicitudNotificacionCard";
import SolicitudDetalleModal from "./SolicitudDetalleModal";
import axios from "axios";

const NotificacionesSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [detalleSolicitud, setDetalleSolicitud] = useState(null);

  useEffect(() => {
    const abortController = new AbortController(); // <-- Crear controlador
  
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const perfil = await axios.get("http://localhost:8000/estudiantes/perfil", {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal // <-- Vincular señal
        });
        
        const idEstudiante = perfil.data.idEstudiante;
        
        const res = await axios.get(
          `http://localhost:8000/solicitudes/pendientes/${idEstudiante}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal // <-- Usar la misma señal
          }
        );
        
        setSolicitudes(res.data);
      } catch (error) {
        if (error.name === 'CanceledError') {
          console.log('Solicitud cancelada intencionalmente');
        } else {
          console.error("Error fetching solicitudes:", error);
        }
      }
    };
    
    if (mostrar) fetchSolicitudes();
    
    const interval = setInterval(fetchSolicitudes, 30000);
    
    return () => {
      abortController.abort(); // <-- Cancelar al desmontar
      clearInterval(interval);
    };
  }, [mostrar]);

  const handleClose = (idSolicitud) => {
    setSolicitudes(prev => prev.filter(sol => sol.idSolicitud !== idSolicitud));
  };

  const handleAceptar = async (idSolicitud) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/solicitudes/aceptar/${idSolicitud}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(prev => prev.filter(sol => sol.idSolicitud !== idSolicitud));
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const handleRechazar = async (idSolicitud) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/solicitudes/rechazar/${idSolicitud}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(prev => prev.filter(sol => sol.idSolicitud !== idSolicitud));
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const handleVerDetalles = (idSolicitud) => {
    const solicitud = solicitudes.find(sol => sol.idSolicitud === idSolicitud);
    setDetalleSolicitud(solicitud);
  };

  const handleCerrarDetalles = () => setDetalleSolicitud(null);

  if (!mostrar || solicitudes.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md">
      <button
        className="absolute top-0 right-0 text-xs text-gray-400 hover:text-gray-600 p-2"
        onClick={() => setMostrar(false)}
        aria-label="Cerrar todas las notificaciones"
      >
        ×
      </button>
      <div className="space-y-3">
        {solicitudes.map((solicitud) => (
          <SolicitudNotificacionCard
            key={solicitud.idSolicitud}
            idSolicitud={solicitud.idSolicitud}
            fotoLibro={`http://localhost:8000${solicitud.libro_solicitado?.foto}`}
            tituloLibro={solicitud.libro_solicitado?.titulo}
            autorLibro={solicitud.libro_solicitado?.autor}
            categoriaLibro={solicitud.libro_solicitado?.categoria?.nombre || "Sin categoría"}
            nombreSolicitante={solicitud.solicitante?.nombre}
            fechaSolicitud={new Date(solicitud.fechaSolicitud).toLocaleDateString()}
            lugarEncuentro={solicitud.lugarEncuentro}
            onAceptar={handleAceptar}
            onRechazar={handleRechazar}
            onClose={handleClose}
            onVerDetalles={handleVerDetalles}
          />
        ))}
      </div>
      {detalleSolicitud && (
        <SolicitudDetalleModal
          solicitud={detalleSolicitud}
          isOpen={!!detalleSolicitud}
          onClose={handleCerrarDetalles}
        />
      )}
    </div>
  );
};

export default NotificacionesSolicitudes;
