import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import axios from "axios";

const Seguridad = () => {
  const navigate = useNavigate();
  const [contraseniaActual, setContraseniaActual] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);
  const [confirmacion, setConfirmacion] = useState("");

  // Validación de contraseña (puedes mejorarla según tus reglas)
  const validarContrasenia = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Cambio de contraseña (RF-05)
  const handleCambioContrasenia = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (!validarContrasenia(nuevaContrasenia)) {
      setError("La nueva contraseña no cumple los requisitos.");
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
        {
          contraseniaActual,
          nuevaContrasenia,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje("¡Contraseña cambiada! Revisa tu correo para confirmar el cambio.");
      setContraseniaActual("");
      setNuevaContrasenia("");
      setConfirmarContrasenia("");
    } catch (err) {
      setError("Error al cambiar la contraseña. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminación de cuenta (RF-07)
  const handleEliminarCuenta = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (confirmacion !== "ELIMINAR") {
      setError('Debes escribir "ELIMINAR" para confirmar.');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://127.0.0.1:8000/estudiantes/eliminar-cuenta", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      setMensaje("Cuenta eliminada correctamente. Serás redirigido al inicio.");
      setTimeout(() => {
        navigate("/catalogo");
      }, 2000);
    } catch (err) {
      setError("Error al eliminar la cuenta. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Panel lateral de perfil */}
        <PanelPerfil handleLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }} />

        {/* Sección de seguridad */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#722F37] mb-6">Seguridad</h1>

          {/* Cambio de contraseña */}
          <form onSubmit={handleCambioContrasenia} className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold mb-2">Cambiar contraseña</h2>
            {mensaje && <div className="p-2 bg-green-100 text-green-700 rounded">{mensaje}</div>}
            {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={contraseniaActual}
                onChange={(e) => setContraseniaActual(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={confirmarContrasenia}
                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52]"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>

          {/* Eliminación de cuenta */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-2 text-red-700">Eliminar cuenta</h2>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción es <span className="font-bold text-red-700">permanente</span>. Si eliminas tu cuenta, todos tus datos serán borrados y no podrás recuperarlos.
            </p>
            {!showEliminar ? (
              <button
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
                onClick={() => setShowEliminar(true)}
              >
                Eliminar mi cuenta
              </button>
            ) : (
              <form onSubmit={handleEliminarCuenta} className="space-y-3">
                <label className="block text-sm text-gray-700">
                  Escribe <span className="font-bold text-red-700">ELIMINAR</span> para confirmar:
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={confirmacion}
                  onChange={(e) => setConfirmacion(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Eliminando..." : "Confirmar eliminación"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguridad;
