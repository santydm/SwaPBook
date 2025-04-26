// src/components/estudiante/Perfil.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Perfil = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/estudiante/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setEstudiante(response.data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setError('Error al cargar el perfil. Por favor intenta nuevamente.');
        
        // Si el token es inválido o ha expirado, redirigir al login
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-Swap-beige" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md flex flex-col">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-[#722F37]">
                <img 
                  src={estudiante?.fotoPerfil || "https://via.placeholder.com/150"} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-[#722F37]">Mi perfil</h2>
            </div>

            <nav className="flex-grow">
              <ul className="space-y-2">
                <li>
                  <Link to="/perfil" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                    Mi perfil
                  </Link>
                </li>
                <li>
                  <Link to="/mis-libros" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                    Mis libros
                  </Link>
                </li>
                <li>
                  <Link to="/mis-solicitudes" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                    Mis solicitudes
                  </Link>
                </li>
                <li>
                  <Link to="/mis-intercambios" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                    Mis intercambios
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Botón de cerrar sesión en el sidebar */}
            <button 
              className="mt-8 py-2 px-4 bg-Swap-beige text-white rounded-md hover:bg-Swap-vinotinto transition-colors"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>

          {/* Contenido del perfil */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
            {/* Información del usuario */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#722F37]">{estudiante?.nombre || "Nombre no disponible"}</h1>
              <p className="text-gray-600 mt-1">{estudiante?.email || "Email no disponible"}</p>
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