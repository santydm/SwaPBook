import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import Navbar from "../../components/ui/Navbar";
import axios from "axios";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const Seguridad = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);

  const [contraseniaActual, setContraseniaActual] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [contraseniaEliminar, setContraseniaEliminar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showDeletePass, setShowDeletePass] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/estudiantes/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEstudiante(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchPerfil();
  }, [navigate]);

  // Validación de contraseña
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
      setError("La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo");
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/auth/cambiar-contrasenia",
        {
          current_password: contraseniaActual,
          new_password: nuevaContrasenia,
          confirm_new_password: confirmarContrasenia,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("¡Contraseña actualizada correctamente!");
      setContraseniaActual("");
      setNuevaContrasenia("");
      setConfirmarContrasenia("");
    } catch (error) {
      setError(error.response?.data?.detail || "Error al cambiar la contraseña");
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
      setError("Debes ingresar tu contraseña para confirmar");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://127.0.0.1:8000/estudiantes/eliminar", {
        data: { contrasenia: contraseniaEliminar },
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      setMensaje("Cuenta eliminada exitosamente. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.detail || "Error al eliminar la cuenta");
    } finally {
      setIsLoading(false);
      setContraseniaEliminar("");
    }
  };

  return (
    <>
      <Navbar usuario={estudiante} />
      <div className="min-h-screen flex items-center justify-center bg-Swap-cream">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <PanelPerfil
            handleLogout={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />

          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md">
            {/* Sección Cambio de Contraseña */}
            <form onSubmit={handleCambioContrasenia} className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-[#722F37] mb-4">Cambiar Contraseña</h2>

              {/* Mensajes de feedback */}
              {mensaje && (
                <div className="p-3 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
                  <FiCheckCircle className="flex-shrink-0" />
                  <span>{mensaje}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
                  <FiAlertCircle className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Campo Contraseña Actual */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                <input
                  type={showCurrentPass ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={contraseniaActual}
                  onChange={(e) => setContraseniaActual(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-8 text-gray-500"
                >
                  {showCurrentPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Campo Nueva Contraseña */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                  type={showNewPass ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={nuevaContrasenia}
                  onChange={(e) => setNuevaContrasenia(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-8 text-gray-500"
                >
                  {showNewPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Campo Confirmar Contraseña */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={confirmarContrasenia}
                  onChange={(e) => setConfirmarContrasenia(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-8 text-gray-500"
                >
                  {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md flex items-center justify-center gap-2 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#a67c52]"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                    Procesando...
                  </>
                ) : (
                  "Actualizar Contraseña"
                )}
              </button>
            </form>

            {/* Sección Eliminación de Cuenta */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-red-700 mb-4">Eliminar Cuenta</h2>
              <p className="text-sm text-gray-600 mb-6">
                Esta acción es permanente. Todos tus datos serán eliminados y no podrán recuperarse.
              </p>
              {!showEliminar ? (
                <button
                  onClick={() => setShowEliminar(true)}
                  className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar Mi Cuenta
                </button>
              ) : (
                <form onSubmit={handleEliminarCuenta} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingresa tu contraseña para confirmar
                    </label>
                    <input
                      type={showDeletePass ? "text" : "password"}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                      value={contraseniaEliminar}
                      onChange={(e) => setContraseniaEliminar(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePass(!showDeletePass)}
                      className="absolute right-3 top-8 text-gray-500"
                    >
                      {showDeletePass ? <FiEyeOff /> : <FiEye />}
                    </button>
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
                      className={`flex-1 py-2 px-4 bg-red-600 text-white font-medium rounded-md flex items-center justify-center gap-2 ${
                        isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-red-700"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                          Eliminando...
                        </>
                      ) : (
                        "Confirmar Eliminación"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Seguridad;
