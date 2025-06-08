import { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader, FiCheck, FiX, FiUser, FiEdit } from "react-icons/fi";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRol, setNewRol] = useState("");
  const [newStatus, setNewStatus] = useState(true);

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

  // Obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/admin/estudiantes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
      setCurrentUserId(getCurrentUserId());
    } catch (error) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar rol de usuario
  const confirmRoleChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/admin/estudiantes/${selectedUser.idEstudiante}/rol`,
        { nuevoRol: newRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsuarios(usuarios.map(user => 
        user.idEstudiante === selectedUser.idEstudiante ? { ...user, rol: newRol } : user
      ));
    } catch (error) {
      console.error("Error actualizando rol:", error);
    } finally {
      setShowRoleModal(false);
    }
  };

  // Cambiar estado de usuario
  const confirmStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/admin/estudiantes/${selectedUser.idEstudiante}/estado`,
        { activo: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUsuarios(usuarios.map(user => 
        user.idEstudiante === selectedUser.idEstudiante ? { ...user, activo: newStatus } : user
      ));
    } catch (error) {
      console.error("Error actualizando estado:", error);
    } finally {
      setShowStatusModal(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-[#722F37]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Modales de confirmación */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar cambio de rol</h2>
            <p className="mb-6">¿Estás seguro de cambiar el rol de {selectedUser?.nombre} a {newRol}?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 bg-[#722F37] text-white rounded hover:bg-[#5A252B]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar cambio de estado</h2>
            <p className="mb-6">¿Estás seguro de marcar a {selectedUser?.nombre} como {newStatus ? "activo" : "inactivo"}?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-[#722F37] text-white rounded hover:bg-[#5A252B]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#722F37] mb-6">Gestión de Usuarios</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f9f6f2]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#722F37] uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#722F37] uppercase">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#722F37] uppercase">Fecha Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#722F37] uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#722F37] uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((usuario) => {
                const esUsuarioActual = usuario.idEstudiante === currentUserId;
                
                return (
                  <tr key={usuario.idEstudiante}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-[#722F37]" />
                        {usuario.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.correoInstitucional}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={usuario.rol}
                        onChange={(e) => {
                          setSelectedUser(usuario);
                          setNewRol(e.target.value);
                          setShowRoleModal(true);
                        }}
                        className={`bg-white border border-[#C9B084] rounded px-2 py-1 text-sm focus:ring-[#722F37] focus:border-[#722F37] ${
                          esUsuarioActual ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                        }`}
                        disabled={esUsuarioActual}
                      >
                        <option value="estudiante">Estudiante</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        usuario.activo 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;
