import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";

const Perfil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEstudiante(response.data);
      } catch (error) {
        setError('Error al cargar el perfil. Por favor intenta nuevamente.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handlePerfilActualizado = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setEstudiante(res.data))
      .catch(() => setError('Error al recargar el perfil.'))
      .finally(() => setLoading(false));
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <h1 className="text-2xl font-bold text-center mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block py-2 px-6 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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

      {/* Contenido principal */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Panel lateral de perfil */}
          <PanelPerfil
            estudiante={estudiante}
            handleLogout={handleLogout}
            onModificarPerfil={() => setShowModal(true)}
          />

          {/* Contenido del perfil */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
            {/* Información del usuario */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#722F37]">{estudiante?.nombre || "Nombre no disponible"}</h1>
              <p className="text-gray-600 mt-1">{estudiante?.correoInstitucional || estudiante?.email || "Email no disponible"}</p>
              <p className="text-gray-500 text-sm mt-2">
                Fecha de registro: {estudiante?.fechaRegistro || "Fecha no disponible"}
              </p>
            </div>

            {/* Historial */}
            <div>
              <h2 className="text-xl font-semibold text-[#722F37] mb-4">Historial</h2>
              {estudiante?.historial?.length > 0 ? (
                <ul className="space-y-4">
                  {estudiante.historial.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={item.completado}
                        readOnly
                        className="mt-1 h-5 w-5 text-Swap-beige focus:ring-Swap-beige border-gray-300 rounded"
                      />
                      <div>
                        <span className="text-gray-500 text-sm block">{item.fecha}</span>
                        <p className="font-medium">
                          {item.tipo} de <span className="text-[#722F37]">"{item.libro}"</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay historial disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Perfil;
