import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import axios from "axios";

const Seguridad = () => {
  const navigate = useNavigate();
  const [contraseniaActual, setContraseniaActual] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [contraseniaEliminar, setContraseniaEliminar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  // Validación de contraseña (mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo)
  const validarContrasenia = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Cambio de contraseña
  const handleCambioContrasenia = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    
    if (!validarContrasenia(nuevaContrasenia)) {
      setError("La nueva contraseña no cumple los requisitos de seguridad.");
      return;
    }
    
    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/estudiantes/cambiar-contrasenia",
        { contraseniaActual, nuevaContrasenia },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Contraseña actualizada exitosamente.");
      setContraseniaActual("");
      setNuevaContrasenia("");
      setConfirmarContrasenia("");
    } catch (error) {
      setError(error.response?.data?.detail || "Error al cambiar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminación de cuenta
  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    
    if (!contraseniaEliminar) {
      setError("Debes ingresar tu contraseña para confirmar.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://127.0.0.1:8000/estudiantes/eliminar", {
        data: { contrasenia: contraseniaEliminar },
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem("token");
      setMensaje("Cuenta eliminada correctamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.detail || "Error al eliminar la cuenta.");
    } finally {
      setIsLoading(false);
      setContraseniaEliminar("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Panel lateral */}
        <PanelPerfil handleLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }} />

        {/* Sección principal */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          {/* Cambio de contraseña */}
          <form onSubmit={handleCambioContrasenia} className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-[#722F37] mb-4">Cambiar contraseña</h2>
            
            {mensaje && <div className="p-3 bg-green-100 text-green-700 rounded-md">{mensaje}</div>}
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={contraseniaActual}
                onChange={(e) => setContraseniaActual(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 símbolo.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={confirmarContrasenia}
                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>

          {/* Eliminación de cuenta */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-red-700 mb-4">Eliminar cuenta</h2>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción eliminará permanentemente todos tus datos. Para confirmar, ingresa tu contraseña.
            </p>

            {!showEliminar ? (
              <button
                onClick={() => setShowEliminar(true)}
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar mi cuenta
              </button>
            ) : (
              <form onSubmit={handleEliminarCuenta} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    value={contraseniaEliminar}
                    onChange={(e) => setContraseniaEliminar(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEliminar(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Eliminando..." : "Confirmar eliminación"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguridad;
