import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiLoader, FiSearch, FiUser, FiUsers, FiCheckCircle, FiXCircle, FiPower } from "react-icons/fi";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const debounceTimeout = useRef(null);

  // Estadísticas calculadas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(user => user.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;

  // Obtener ID del usuario actual desde el token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.sub);
    } catch {
      return null;
    }
  };

  // Obtener todos los usuarios excepto el actual
  const fetchUsuarios = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query 
        ? `http://localhost:8000/admin/estudiantes/filtrar?search=${encodeURIComponent(query)}`
        : 'http://localhost:8000/admin/estudiantes';
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filtrar usuario admin actual
      const filteredUsers = res.data.filter(user => 
        user.idEstudiante !== currentUserId
      );
      
      setUsuarios(filteredUsers);
      setError("");
    } catch (error) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar rol de usuario
  const handleRoleChange = async (idEstudiante, nuevoRol) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/admin/estudiantes/${idEstudiante}/rol`,
        { nuevo_rol: nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(prev => 
        prev.map(user => 
          user.idEstudiante === idEstudiante ? { ...user, rol: nuevoRol } : user
        )
      );
      await fetchUsuarios(searchTerm);
    } catch (error) {
      console.error("Error actualizando rol:", error);
      alert("No se pudo actualizar el rol. Intente nuevamente.");
    }
  };

  // Cambiar estado activo/inactivo de usuario
  const handleEstadoChange = async (idEstudiante, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/admin/estudiantes/${idEstudiante}/estado`,
        { activo: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios(prev => 
        prev.map(user => 
          user.idEstudiante === idEstudiante ? { ...user, activo: nuevoEstado } : user
        )
      );
      await fetchUsuarios(searchTerm);
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado. Intente nuevamente.");
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchUsuarios(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
  }, [searchTerm, currentUserId]);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  useEffect(() => {
    if (currentUserId !== null) {
      fetchUsuarios();
    }
    // eslint-disable-next-line
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-[#722F37] mb-4" />
        <span className="text-[#5A252B]">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 max-w-lvw mx-auto p-10 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-[#722F37]">Gestión de Usuarios</h1>
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            className="w-full pl-10 pr-4 py-2 border-2 border-[#C9B084] rounded-lg focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-[#5A252B]" />
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#722F37] text-white p-4 rounded-lg flex items-center gap-4">
          <FiUsers className="text-3xl" />
          <div>
            <p className="text-sm">Total usuarios</p>
            <p className="text-2xl font-bold">{totalUsuarios}</p>
          </div>
        </div>
        
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-4">
          <FiCheckCircle className="text-3xl" />
          <div>
            <p className="text-sm">Usuarios activos</p>
            <p className="text-2xl font-bold">{usuariosActivos}</p>
          </div>
        </div>
        
        <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-center gap-4">
          <FiXCircle className="text-3xl" />
          <div>
            <p className="text-sm">Usuarios inactivos</p>
            <p className="text-2xl font-bold">{usuariosInactivos}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Bandeja grande con scroll solo en la tabla */}
      <div className="overflow-x-auto rounded-lg border border-[#C9B084] max-h-[600px]">
        <table className="min-w-full divide-y divide-[#C9B084]">
          <thead className="bg-[#f9f6f2] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Correo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Registro</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9B084] bg-white">
            {usuarios.map((usuario) => (
              <tr key={usuario.idEstudiante}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-[#722F37]" />
                    {usuario.nombre}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.correoInstitucional}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={usuario.rol}
                    onChange={(e) => handleRoleChange(usuario.idEstudiante, e.target.value)}
                    className="bg-white border border-[#C9B084] rounded px-2 py-1 text-sm focus:ring-[#722F37] focus:border-[#722F37]"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    usuario.activo 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEstadoChange(usuario.idEstudiante, !usuario.activo)}
                    className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                      usuario.activo
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <FiPower className="w-4 h-4" />
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-[#5A252B]">No se encontraron usuarios</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
