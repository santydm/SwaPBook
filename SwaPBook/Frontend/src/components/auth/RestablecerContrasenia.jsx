// src/components/auth/RestablecerContrasenia.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fondoSwap from "../../img/fondoSwap.webp";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const validarContrasenia = (contrasenia) => {
  const errores = [];
  if (contrasenia.length < 8) errores.push("Debe tener al menos 8 caracteres.");
  if (!/[A-Z]/.test(contrasenia)) errores.push("Debe tener al menos una mayúscula.");
  if (!/[a-z]/.test(contrasenia)) errores.push("Debe tener al menos una minúscula.");
  if (!/[0-9]/.test(contrasenia)) errores.push("Debe tener al menos un número.");
  return errores;
};

const RestablecerContrasenia = () => {
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  // Obtener token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!token) {
      setError("Token de recuperación no encontrado.");
      return;
    }
    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const errores = validarContrasenia(nuevaContrasenia);
    if (errores.length > 0) {
      setError(errores.join(" "));
      return;
    }

    setEnviando(true);
    try {
      await axios.post("http://localhost:8000/auth/restablecer-contrasenia", {
        token,
        nueva_contrasenia: nuevaContrasenia,
        confirmar_contrasenia: confirmarContrasenia
      });
      setMensaje("¡Contraseña actualizada exitosamente!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "No se pudo actualizar la contraseña. Intenta nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${fondoSwap})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="w-full h-full bg-black bg-opacity-80"></div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#722F37]">Restablecer Contraseña</h1>
          <p className="text-gray-600 mb-6">
            Ingresa y confirma tu nueva contraseña.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={mostrarNueva ? "text" : "password"}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                placeholder="Nueva contraseña"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setMostrarNueva((v) => !v)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-[#722F37]"
                tabIndex={-1}
                aria-label={mostrarNueva ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarNueva ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="relative">
              <input
                type={mostrarConfirmar ? "text" : "password"}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                placeholder="Confirmar nueva contraseña"
                value={confirmarContrasenia}
                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar((v) => !v)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-[#722F37]"
                tabIndex={-1}
                aria-label={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarConfirmar ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-2 bg-Swap-beige text-white font-semibold rounded hover:bg-Swap-vinotinto transition-colors"
            >
              {enviando ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
          <div className="mt-4 text-left text-xs text-gray-500">
            <div>Requisitos de la contraseña:</div>
            <ul className="list-disc ml-5">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una mayúscula</li>
              <li>Al menos una minúscula</li>
              <li>Al menos un número</li>
            </ul>
          </div>
          {mensaje && <div className="mt-4 text-green-700 font-semibold">{mensaje}</div>}
          {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
          <div className="mt-6">
            <Link to="/login" className="text-[#722F37] hover:underline">
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasenia;
