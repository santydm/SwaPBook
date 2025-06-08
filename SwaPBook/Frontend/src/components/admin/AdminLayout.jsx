import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AdminLayout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      if (decoded.rol !== 'administrador') navigate('/');
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#722F37] text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-8">Panel Admin</h2>
        <nav className="space-y-2 flex-1">
          <Link to="/admin" className="block p-2 hover:bg-[#C9B084] rounded">Dashboard</Link>
          <Link to="/admin/usuarios" className="block p-2 hover:bg-[#C9B084] rounded">Usuarios</Link>
          <Link to="/admin/libros" className="block p-2 hover:bg-[#C9B084] rounded">Libros</Link>
          <Link to="/admin/intercambios" className="block p-2 hover:bg-[#C9B084] rounded">Intercambios</Link>
          <Link to="/admin/estadisticas" className="block p-2 hover:bg-[#C9B084] rounded">Estadísticas</Link>
        </nav>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="mt-auto p-2 hover:bg-[#C9B084] rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-[#f9f6f2] p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
