// src/componentes/autenticacion/Registro.jsx
import { Link } from 'react-router-dom';

const Registro = () => {
  return (
    <div className="registro-container">
      {/* Sección de Título y Eslogan */}
      <header className="registro-header">
        <h1>Registro</h1>
        <p className="eslogan">Reutiliza • Intercambia • Conoce Libros</p>
      </header>

      {/* Sección del Formulario */}
      <form className="registro-form">
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="form-group">
          <label>Correo institucional</label>
          <input
            type="email"
            name="correo"
            placeholder="correo@institucion.edu"
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="contraseña"
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="confirmarContraseña"
            placeholder="••••••••"
          />
        </div>

        <button type="submit">
          Registrarse
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link>
        </p>
      </form>

      {/* Sección del Footer */}
      <footer className="registro-footer">
        <div className="footer-brand">
          <h2>SwaPBook</h2>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <p>Contratantes</p>
            <a href="#">Privacidad</a>
          </div>
          
          <div className="link-group">
            <p>Políticas</p>
            <a href="#">Términos y condiciones</a>
          </div>
          
          <div className="link-group">
            <p>Quiénes somos</p>
            <a href="#">Libertas</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Registro;