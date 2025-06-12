import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmarCambioCorreo = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        await axios.get(`http://localhost:8000/estudiantes/verificar_cambio_correo/${token}`);
        
        // Actualizar datos locales
        const token = localStorage.getItem("token");
        const perfil = await axios.get("http://localhost:8000/estudiantes/perfil", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.setItem("userData", JSON.stringify(perfil.data));
        
        navigate("/perfil", {
          state: { success: "¡Correo verificado y cambios aplicados!" }
        });
      } catch (error) {
        navigate("/modificar-perfil", {
          state: { error: "Enlace inválido o expirado" }
        });
      }
    };
    
    verificarToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <div className="animate-spin h-12 w-12 border-4 border-Swap-beige rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando cambios...</p>
      </div>
    </div>
  );
};

export default ConfirmarCambioCorreo;
