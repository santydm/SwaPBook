import { useEffect, useState, useRef } from "react";
import SolicitudNotificacionCard from "./SolicitudNotificacionCard";
import SolicitudDetalleModal from "./SolicitudDetalleModal";
import axios from "axios";

const NotificacionesSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalleSolicitud, setDetalleSolicitud] = useState(null);
  const timersRef = useRef({});
  const dismissedIdsRef = useRef(new Set());
  const modalOpenRef = useRef(false);

  // Obtener solicitudes pendientes
  const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const perfil = await axios.get("http://localhost:8000/estudiantes/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const res = await axios.get(
        `http://localhost:8000/solicitudes/pendientes/${perfil.data.idEstudiante}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filtrar solicitudes nuevas no descartadas
      const nuevasSolicitudes = res.data.filter(
        solicitud =>
          !dismissedIdsRef.current.has(solicitud.idSolicitud) &&
          !solicitudes.some(s => s.idSolicitud === solicitud.idSolicitud)
      );

      setSolicitudes(prev => [...prev, ...nuevasSolicitudes]);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  // Manejar auto-cierre de notificaciones
  const iniciarTimer = (solicitud) => {
    if (timersRef.current[solicitud.idSolicitud] || modalOpenRef.current) return;

    timersRef.current[solicitud.idSolicitud] = setTimeout(() => {
      dismissedIdsRef.current.add(solicitud.idSolicitud);
      setSolicitudes(prev => prev.filter(s => s.idSolicitud !== solicitud.idSolicitud));
      delete timersRef.current[solicitud.idSolicitud];
    }, 5000);
  };

  useEffect(() => {
    solicitudes.forEach(iniciarTimer);

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, [solicitudes]);

  // Actualizar solicitudes cada 10 segundos
  useEffect(() => {
    fetchSolicitudes();
    const interval = setInterval(fetchSolicitudes, 10000);
    return () => clearInterval(interval);
  }, []);

  // Acciones principales
  const handleAceptarRechazar = async (idSolicitud, accion) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/solicitudes/${accion}/${idSolicitud}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dismissedIdsRef.current.add(idSolicitud);
      setSolicitudes(prev => prev.filter(s => s.idSolicitud !== idSolicitud));
      setDetalleSolicitud(null);
      clearTimeout(timersRef.current[idSolicitud]);
      delete timersRef.current[idSolicitud];
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
    }
  };

  // Manejar visualización de detalles
  const handleVerDetalles = (idSolicitud) => {
    const solicitud = solicitudes.find(s => s.idSolicitud === idSolicitud);
    if (!solicitud) return;

    // Pausar timer y marcar modal como abierto
    modalOpenRef.current = true;
    clearTimeout(timersRef.current[idSolicitud]);
    setDetalleSolicitud({
      ...solicitud,
      libroSolicitado: solicitud.libro_solicitado,
      solicitante: solicitud.solicitante
    });
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    modalOpenRef.current = false;
    setDetalleSolicitud(null);

    // Si la notificación aún existe, reiniciar su timer
    const solicitudExistente = solicitudes.find(
      s => s.idSolicitud === detalleSolicitud?.idSolicitud
    );
    if (solicitudExistente) {
      iniciarTimer(solicitudExistente);
    }
  };

  // Cerrar notificación manualmente
  const handleCerrarNotificacion = (idSolicitud) => {
    dismissedIdsRef.current.add(idSolicitud);
    setSolicitudes(prev => prev.filter(s => s.idSolicitud !== idSolicitud));
    clearTimeout(timersRef.current[idSolicitud]);
    delete timersRef.current[idSolicitud];
  };

  return (
    <>
      {/* CONTENEDOR DE NOTIFICACIONES */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {solicitudes.map(solicitud => (
          <div key={solicitud.idSolicitud} className="pointer-events-auto">
            <SolicitudNotificacionCard
              idSolicitud={solicitud.idSolicitud}
              fotoLibro={solicitud.libro_solicitado?.foto}
              tituloLibro={solicitud.libro_solicitado?.titulo}
              autorLibro={solicitud.libro_solicitado?.autor}
              categoriaLibro={solicitud.libro_solicitado?.categoria?.nombre || "Sin categoría"}
              nombreSolicitante={solicitud.solicitante?.nombre}
              fechaSolicitud={new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
              lugarEncuentro={solicitud.lugarEncuentro}
              onAceptar={() => handleAceptarRechazar(solicitud.idSolicitud, 'aceptar')}
              onRechazar={() => handleAceptarRechazar(solicitud.idSolicitud, 'rechazar')}
              onVerDetalles={() => handleVerDetalles(solicitud.idSolicitud)}
              onClose={handleCerrarNotificacion}
              animated={true}
              wide={false}
              autoClose={true}
              autoCloseTime={5000}
            />
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLES - FUERA DEL CONTENEDOR DE NOTIFICACIONES */}
      <SolicitudDetalleModal
        solicitud={detalleSolicitud}
        isOpen={!!detalleSolicitud}
        onClose={handleCerrarModal}
        onAceptar={() => handleAceptarRechazar(detalleSolicitud?.idSolicitud, 'aceptar')}
        onRechazar={() => handleAceptarRechazar(detalleSolicitud?.idSolicitud, 'rechazar')}
      />
    </>
  );
};

export default NotificacionesSolicitudes;
