import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";

const Perfil = () => {
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
        setError('Error al cargar información del perfil');
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
          <p className="mt-3">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#722F37] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SwapBook</h1>
          <nav>
            <Link 
              to="/catalogo" 
              className="px-4 py-2 bg-white text-[#722F37] rounded-md hover:bg-gray-100 transition-colors"
            >
              Catálogo
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <PanelPerfil
            estudiante={estudiante}
            handleLogout={handleLogout}
          />

          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#722F37] mb-6">Historial de Intercambios</h1>
            
            {loadingHistorial ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
              </div>
            ) : historial.length > 0 ? (
              <div className="space-y-4">
                {historial.map((intercambio) => (
                  <div key={intercambio.idIntercambio} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#722F37]">
                          {intercambio.estado} - {new Date(intercambio.fechaEncuentro).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-semibold">Libro solicitado:</span> {intercambio.libro_solicitado?.titulo}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Libro ofrecido:</span> {intercambio.libro_ofrecido?.titulo}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        intercambio.estado === "Finalizado" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {intercambio.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay registros en tu historial de intercambios</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
