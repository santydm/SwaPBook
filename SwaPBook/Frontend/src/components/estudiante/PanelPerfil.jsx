import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PanelPerfil = ({ handleLogout, compact = false }) => {
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Configuración de colores
  const colorPrimario = '#722F37';
  const colorSecundario = '#C9B084';

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setEstudiante(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar datos del perfil');
        setLoading(false);
      }
    };

    fetchEstudiante();
  }, []);

  // Items del menú
  const menuItems = [
    { path: '/perfil', label: 'Mi perfil' },
    { path: '/historial', label: 'Historial' },
    { path: '/mis-libros', label: 'Mis libros' },
    { path: '/mis-solicitudes', label: 'Mis solicitudes' },
    { path: '/mis-intercambios', label: 'Mis intercambios' },
    { path: '/seguridad', label: 'Seguridad' },
  ];

  if (loading) {
    return <div className="text-center p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`w-full ${!compact && 'md:w-1/4'} bg-white p-6 rounded-lg shadow-md flex flex-col`}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-500 mb-4 overflow-hidden border-4 border-[#722F37]">
          <img 
            src={
              estudiante?.fotoPerfil
                ? `http://localhost:8000${estudiante.fotoPerfil}?t=${Date.now()}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(estudiante?.nombre || "Usuario")}&background=722F37&color=fff&size=150`
            }
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-[#722F37] text-center">
          {estudiante?.nombre || "Nombre no disponible"}
        </h2>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`block py-2 px-3 rounded text-center transition-all ${
                    isActive 
                      ? `bg-[${colorSecundario}/10] text-[${colorPrimario}] font-semibold border-l-4 border-[${colorPrimario}]`
                      : `text-gray-600 hover:bg-[${colorSecundario}/20] hover:text-[${colorPrimario}]`
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button 
        className="mt-8 py-2 px-4 bg-Swap-vinotinto text-white rounded-md hover:bg-Swap-beige hover:text-white transition-colors font-semibold"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default PanelPerfil;
