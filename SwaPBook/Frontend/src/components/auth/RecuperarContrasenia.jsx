// src/components/auth/RecuperarContrasenia.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import fondoSwap from "../../img/fondoSwap.webp";
import axios from "axios";

const RecuperarContrasenia = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setEnviando(true);

    try {
      const res = await axios.post("http://localhost:8000/auth/recuperar-contrasenia", {
        correoInstitucional: correo
      });
      setMensaje(res.data.mensaje || "Revisa tu correo para continuar el proceso.");
    } catch (err) {
      setError(
        err.response?.data?.detail || "No se pudo enviar el correo. Intenta nuevamente."
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
          <h1 className="text-2xl font-bold mb-4 text-[#722F37]">Recuperar Contraseña</h1>
          <p className="text-gray-600 mb-6">
            Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#722F37]"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-2 bg-Swap-beige text-white font-semibold rounded hover:bg-Swap-vinotinto transition-colors"
            >
              {enviando ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
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

export default RecuperarContrasenia;
