import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FiUser, FiClock, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hora, setHora] = useState(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  const [adminInfo, setAdminInfo] = useState({ nombre: 'Admin', rol: 'Administrador' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.rol !== 'administrador') navigate('/');
      setAdminInfo({
        nombre: decoded.nombre || 'Administrador',
        rol: decoded.rol || 'Administrador'
      });
    } catch (error) {
      navigate('/login');
    }

    const interval = setInterval(() => {
      setHora(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/usuarios', label: 'Usuarios' },
    { path: '/admin/libros', label: 'Libros' },
    { path: '/admin/intercambios', label: 'Intercambios' },
    { path: '/admin/estadisticas', label: 'Estadísticas' },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-[#722F37] text-white p-4 flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-center">
            SwapBook <span className="block text-base font-normal">Panel Admin</span>
          </h2>
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="bg-Swap-cream rounded-full p-3 mb-1 flex items-center justify-center">
              <FiUser className="text-[#722F37] w-12 h-12" />
            </div>
            <span className="text-lg font-bold">{adminInfo.nombre}</span>
            <span className="text-xs bg-Swap-cream text-[#722F37] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Administrador
            </span>
          </div>
          <div className="flex justify-center items-center gap-2 text-sm text-[#C9B084] mt-2">
            <FiClock />
            <span>{hora}</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-2 rounded transition-colors ${
                location.pathname === item.path
                  ? 'bg-Swap-cream text-[#722F37] font-semibold'
                  : 'hover:bg-Swap-cream/50 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="mt-2 flex items-center gap-2 w-full p-2 hover:bg-[#C9B084]/50 rounded transition-colors"
          >
            <FiLogOut />
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-Swap-cream p-8 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
