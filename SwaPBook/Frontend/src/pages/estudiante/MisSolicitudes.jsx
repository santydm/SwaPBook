import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import SolicitudDetalleModal from "../../components/solicitudes/SolicitudDetalleModal";
import SolicitudNotificacionCard from "../../components/notificaciones/SolicitudNotificacionCard";
import Navbar from "../../components/ui/Navbar";

const MisSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
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
        
        const perfilResponse = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setEstudiante(perfilResponse.data);
        const idEstudiante = perfilResponse.data.idEstudiante;
        
        const solicitudesResponse = await axios.get(
          `http://127.0.0.1:8000/solicitudes/pendientes/${idEstudiante}`, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setSolicitudes(solicitudesResponse.data);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('No se pudieron cargar las solicitudes. Intenta nuevamente.');
        }
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
    <>
      <Navbar usuario={estudiante} />
      <div className="min-h-screen flex items-center justify-center bg-Swap-cream">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Panel lateral */}
          <PanelPerfil handleLogout={handleLogout} />

          {/* Sección de solicitudes scrollable */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-3">
              <h1 className="text-2xl font-bold text-[#722F37] text-center flex-1">
                Solicitudes Recibidas
              </h1>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                <span className="ml-4 text-[#722F37] font-semibold">Cargando solicitudes...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : solicitudes.length > 0 ? (
              <div className="w-full">
                <div
                  className="grid grid-cols-1 gap-4 w-full max-h-[70vh] items-center overflow-y-auto pr-2"
                  style={{ minHeight: "200px" }}
                >
                  {solicitudes.map((solicitud) => (
                    <SolicitudNotificacionCard
                      key={solicitud.idSolicitud}
                      idSolicitud={solicitud.idSolicitud}
                      fotoLibro={`http://localhost:8000${solicitud.libro_solicitado?.foto}`}
                      tituloLibro={solicitud.libro_solicitado?.titulo || "Sin título"}
                      autorLibro={solicitud.libro_solicitado?.autor || "Autor desconocido"}
                      categoriaLibro={solicitud.libro_solicitado?.categoria?.nombre || "Sin categoría"}
                      nombreSolicitante={solicitud.solicitante?.nombre || "Usuario"}
                      fechaSolicitud={new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                      lugarEncuentro={solicitud.lugarEncuentro || "Lugar no especificado"}
                      onAceptar={handleAceptar}
                      onRechazar={handleRechazar}
                      onVerDetalles={() => setSolicitudSeleccionada(solicitud)}
                      animate={false}
                      wide={true}
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
    </>
  );
};

export default MisSolicitudes;
