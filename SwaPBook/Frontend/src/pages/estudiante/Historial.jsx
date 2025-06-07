import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import Navbar from "../../components/ui/Navbar";

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

        // Obtener perfil del estudiante
        const perfilResponse = await axios.get('http://localhost:8000/estudiantes/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEstudiante(perfilResponse.data);

        // Obtener historial de intercambios
        const historialResponse = await axios.get(
          `http://localhost:8000/intercambios/mis-intercambios/${perfilResponse.data.idEstudiante}?estado=Finalizado,Cancelado`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setHistorial(historialResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
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
    <>
      <Navbar usuario={estudiante} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Panel lateral */}
          <PanelPerfil handleLogout={handleLogout} />

          {/* Sección principal centrada */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h1 className="text-2xl font-bold text-[#722F37] mb-6 text-center">Historial de Intercambios</h1>
            
            {loadingHistorial ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                <span className="ml-4 text-[#722F37]">Cargando historial...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : historial.length > 0 ? (
              <div className="w-full flex flex-col gap-4">
                {historial.map((intercambio) => (
                  <div 
                    key={intercambio.idIntercambio} 
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 w-full"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-medium px-2 py-1 rounded ${
                            intercambio.estado === "Finalizado" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {intercambio.estado}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(intercambio.fechaEncuentro).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-[#722F37]">Libro solicitado:</span>
                            <p className="text-gray-600">{intercambio.libro_solicitado?.titulo || "Sin título"}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-[#722F37]">Libro ofrecido:</span>
                            <p className="text-gray-600">{intercambio.libro_ofrecido?.titulo || "Sin título"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
    </>
  );
};

export default Historial;
