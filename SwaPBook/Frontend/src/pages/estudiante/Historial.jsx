import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import Navbar from "../../components/ui/Navbar";
import { FiBookOpen, FiUser, FiLayers, FiClock } from "react-icons/fi";

// Card compacta, alineada y sin espacios en blanco
const CardIntercambio = ({ intercambio }) => {
  const formatFecha = (fecha) =>
    fecha ? new Date(fecha).toLocaleDateString() : "Sin fecha";
  const formatHora = (fecha) =>
    fecha ? new Date(fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between transition-transform hover:scale-[1.01] mb-4 w-full"
      style={{ minWidth: 260, maxWidth: 320, minHeight: 270, maxHeight: "auto" }}
    >
      {/* Cabecera alineada */}
      <div className="bg-[#722F37] p-4 flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          intercambio.estado === "Finalizado"
            ? "bg-green-100 text-green-700"
            : intercambio.estado === "Cancelado"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {intercambio.estado}
        </span>
        <span className="text-white/90 text-sm flex items-center gap-1">
          <FiClock className="inline-block" />
          {formatFecha(intercambio.fechaCambioEstado)} {formatHora(intercambio.fechaCambioEstado)}
        </span>
      </div>

      {/* Nombres de los implicados */}
      <div className="px-5 pt-3 flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <FiUser className="text-Swap-beige" />
          <span className="font-semibold text-[#722F37]">Solicitante:</span>
          <span className="truncate">{intercambio.estudiante?.nombre || "Desconocido"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUser className="text-Swap-beige" />
          <span className="font-semibold text-[#722F37]">Receptor:</span>
          <span className="truncate">{intercambio.estudiante_receptor?.nombre || "Desconocido"}</span>
        </div>
      </div>

      {/* Libros involucrados */}
      <div className="flex-1 flex flex-row gap-2 px-5 py-3 items-center">
        {/* Libro solicitado */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={intercambio.libro_solicitado?.foto 
              ? `http://localhost:8000${intercambio.libro_solicitado.foto}`
              : "/images/book-placeholder.png"}
            alt={intercambio.libro_solicitado?.titulo}
            className="w-14 h-20 object-cover rounded border mb-1"
          />
          <div className="text-xs text-[#722F37] font-bold text-center truncate w-20">
            {intercambio.libro_solicitado?.titulo}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-1">
          <span className="text-[#c1a57b] font-bold text-lg">⇄</span>
        </div>
        {/* Libro ofrecido */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={intercambio.libro_ofrecido?.foto 
              ? `http://localhost:8000${intercambio.libro_ofrecido.foto}`
              : "/images/book-placeholder.png"}
            alt={intercambio.libro_ofrecido?.titulo}
            className="w-14 h-20 object-cover rounded border mb-1"
          />
          <div className="text-xs text-[#722F37] font-bold text-center truncate w-20">
            {intercambio.libro_ofrecido?.titulo}
          </div>
        </div>
      </div>

      {/* Detalles compactos */}
      <div className="px-5 pb-3 flex flex-col gap-0.5 text-xs text-gray-700">
        <div className="flex items-center gap-1">
          <FiLayers className="text-Swap-beige" />
          <span className="truncate">{intercambio.lugarEncuentro || "Sin lugar"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiClock className="text-Swap-beige" />
          <span>
            {formatFecha(intercambio.fechaEncuentro)} {formatHora(intercambio.horaEncuentro)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Historial = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const perfilResponse = await axios.get('http://localhost:8000/estudiantes/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstudiante(perfilResponse.data);

        const historialResponse = await axios.get(
          `http://localhost:8000/intercambios/mis-intercambios/${perfilResponse.data.idEstudiante}?estado=Finalizado,Cancelado`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistorial(historialResponse.data);
      } catch (error) {
        setError('Error al cargar información del historial');
      } finally {
        setLoading(false);
        setLoadingHistorial(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-[#722F37]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-Swap-cream">
      <Navbar usuario={estudiante} />
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <PanelPerfil handleLogout={handleLogout} />
          {/* Bandeja scrollable, cards compactas */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h1 className="text-2xl font-bold text-[#722F37] mb-6">Historial de Intercambios</h1>
            {loadingHistorial ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                <span className="ml-4 text-[#722F37]">Cargando historial...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : historial.length > 0 ? (
              <div
                className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-2"
                style={{ minHeight: "200px" }}
              >
                {historial.map((intercambio) => (
                  <CardIntercambio key={intercambio.idIntercambio} intercambio={intercambio} />
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No hay registros en tu historial de intercambios</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
