import { useEffect, useState, useRef, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import SolicitudNotificacionCard from "/src/components/notificaciones/SolicitudNotificacionCard.jsx";
import SolicitudDetalleModal from "/src/components/solicitudes/SolicitudDetalleModal.jsx";
import axios from "axios";
import { FiX } from "react-icons/fi";

const NotificacionesSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalleSolicitud, setDetalleSolicitud] = useState(null);
  const timersRef = useRef({});
  const dismissedIdsRef = useRef(new Set());
  const modalOpenRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Configuración WebSocket
  const WS_URL = "ws://localhost:8000/ws/notificaciones";
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${WS_URL}?token=${localStorage.getItem("token")}`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      reconnectInterval: 3000,
      onOpen: () => console.log("Conexión WebSocket establecida"),
      onError: (err) => console.error("Error WebSocket:", err),
    }
  );

  // Procesar mensajes WebSocket
  useEffect(() => {
    if (lastJsonMessage?.event === "nueva_solicitud") {
      const nuevaSolicitud = lastJsonMessage.data;
      if (!dismissedIdsRef.current.has(nuevaSolicitud.idSolicitud)) {
        setSolicitudes(prev => [...prev, nuevaSolicitud]);
      }
    }
  }, [lastJsonMessage]);

  // Obtener solicitudes pendientes iniciales
  const fetchSolicitudes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const perfil = await axios.get("http://localhost:8000/estudiantes/perfil", {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal,
      });

      const res = await axios.get(
        `http://localhost:8000/solicitudes/pendientes/${perfil.data.idEstudiante}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortControllerRef.current.signal,
        }
      );

      setSolicitudes(res.data.filter(
        solicitud => !dismissedIdsRef.current.has(solicitud.idSolicitud)
      ));
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error al obtener solicitudes:", error);
      }
    }
  }, []);

  // Manejo auto-cierre de notificaciones
  const iniciarTimer = useCallback((solicitud) => {
    if (timersRef.current[solicitud.idSolicitud] || modalOpenRef.current) return;

    timersRef.current[solicitud.idSolicitud] = setTimeout(() => {
      dismissedIdsRef.current.add(solicitud.idSolicitud);
      setSolicitudes(prev => prev.filter(s => s.idSolicitud !== solicitud.idSolicitud));
      delete timersRef.current[solicitud.idSolicitud];
    }, 5000);
  }, []);

  useEffect(() => {
    solicitudes.forEach(iniciarTimer);
    return () => Object.values(timersRef.current).forEach(clearTimeout);
  }, [solicitudes, iniciarTimer]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchSolicitudes();
    return () => abortControllerRef.current?.abort();
  }, [fetchSolicitudes]);

  // Acciones principales
  const handleAceptarRechazar = useCallback(async (idSolicitud, accion) => {
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
      
      // Notificar a través de WebSocket
      sendJsonMessage({
        event: "actualizacion_solicitud",
        data: { idSolicitud, accion }
      });
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
    }
  }, [sendJsonMessage]);

  // Manejar visualización de detalles
  const handleVerDetalles = useCallback((idSolicitud) => {
    const solicitud = solicitudes.find(s => s.idSolicitud === idSolicitud);
    if (!solicitud) return;

    modalOpenRef.current = true;
    clearTimeout(timersRef.current[idSolicitud]);
    setDetalleSolicitud({
      ...solicitud,
      libroSolicitado: solicitud.libro_solicitado,
      solicitante: solicitud.solicitante
    });
  }, [solicitudes]);

  const handleCerrarModal = useCallback(() => {
    modalOpenRef.current = false;
    setDetalleSolicitud(null);

    const solicitudExistente = solicitudes.find(
      s => s.idSolicitud === detalleSolicitud?.idSolicitud
    );
    if (solicitudExistente) {
      iniciarTimer(solicitudExistente);
    }
  }, [solicitudes, detalleSolicitud, iniciarTimer]);

  const handleCerrarNotificacion = useCallback((idSolicitud) => {
    dismissedIdsRef.current.add(idSolicitud);
    setSolicitudes(prev => prev.filter(s => s.idSolicitud !== idSolicitud));
    clearTimeout(timersRef.current[idSolicitud]);
    delete timersRef.current[idSolicitud];
  }, []);

  return (
    <>
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
