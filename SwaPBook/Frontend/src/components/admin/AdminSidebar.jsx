// src/components/admin/AdminSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBook, FiRefreshCw, FiBarChart3, FiLogOut } from 'react-icons/fi';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Panel general' },
    { path: '/admin/usuarios', icon: FiUsers, label: 'Usuarios' },
    { path: '/admin/libros', icon: FiBook, label: 'Libros' },
    { path: '/admin/intercambios', icon: FiRefreshCw, label: 'Intercambios' },
    { path: '/admin/estadisticas', icon: FiBarChart3, label: 'Estadísticas' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-Swap-vinotinto text-white shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-Swap-vinotinto-dark">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-Swap-vinotinto font-bold text-sm">📚</span>
          </div>
          <span className="text-xl font-bold">SwaPBook</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-Swap-vinotinto-dark text-white'
                    : 'text-gray-300 hover:bg-Swap-vinotinto-dark hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-Swap-vinotinto-dark hover:text-white rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
