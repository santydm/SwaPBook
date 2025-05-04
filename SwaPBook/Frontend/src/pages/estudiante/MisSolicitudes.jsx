// src/pages/estudiante/MisSolicitudes.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import SolicitudNotificacionCard from "../../components/solicitudes/SolicitudNotificacionCard";
import SolicitudDetalleModal from "../../components/solicitudes/SolicitudDetalleModal";

const MisSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Obtener perfil del estudiante
        const perfilResponse = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const idEstudiante = perfilResponse.data.idEstudiante;
        
        // Obtener solicitudes pendientes
        const solicitudesResponse = await axios.get(
          `http://127.0.0.1:8000/solicitudes/pendientes/${idEstudiante}`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setSolicitudes(solicitudesResponse.data);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        setError('No se pudieron cargar las solicitudes. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSolicitudes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAceptar = async (idSolicitud) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/solicitudes/aceptar/${idSolicitud}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSolicitudes(prev => prev.filter(s => s.idSolicitud !== idSolicitud));
      setSolicitudSeleccionada(null);
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
      alert("No se pudo aceptar la solicitud. Intenta nuevamente.");
    }
  };

  const handleRechazar = async (idSolicitud) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/solicitudes/rechazar/${idSolicitud}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSolicitudes(prev => prev.filter(s => s.idSolicitud !== idSolicitud));
      setSolicitudSeleccionada(null);
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      alert("No se pudo rechazar la solicitud. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Panel lateral */}
        <PanelPerfil handleLogout={handleLogout} />

        {/* Sección de solicitudes centrada */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#722F37] mb-6 text-center">Solicitudes Recibidas</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
              <span className="ml-4 text-[#722F37] font-semibold">Cargando solicitudes...</span>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-600">{error}</div>
          ) : solicitudes.length > 0 ? (
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 gap-4 w-full max-w-4xl">
                {solicitudes.map((solicitud) => (
                  <SolicitudNotificacionCard
                    key={solicitud.idSolicitud}
                    idSolicitud={solicitud.idSolicitud}
                    fotoLibro={`http://localhost:8000${solicitud.libro_solicitado?.foto}`}
                    tituloLibro={solicitud.libro_solicitado?.titulo || "Sin título"}
                    autorLibro={solicitud.libro_solicitado?.autor || "Autor desconocido"}
                    nombreSolicitante={solicitud.solicitante?.nombre || "Usuario"}
                    fechaSolicitud={new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    lugarEncuentro={solicitud.lugarEncuentro || "Lugar no especificado"}
                    estado={solicitud.estado}
                    onAceptar={handleAceptar}
                    onRechazar={handleRechazar}
                    onVerDetalles={() => setSolicitudSeleccionada(solicitud)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No tienes solicitudes pendientes.
            </p>
          )}
        </div>
      </div>

      {/* Modal de detalles de solicitud */}
      <SolicitudDetalleModal
        solicitud={solicitudSeleccionada}
        isOpen={!!solicitudSeleccionada}
        onClose={() => setSolicitudSeleccionada(null)}
        onAceptar={handleAceptar}
        onRechazar={handleRechazar}
      />
    </div>
  );
};

export default MisSolicitudes;
