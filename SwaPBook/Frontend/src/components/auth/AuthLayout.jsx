// src/componentes/autenticacion/LayoutAutenticacion.jsx
import { Outlet } from 'react-router-dom';

const LayoutAutenticacion = () => {
  return (
    <div className="layout-autenticacion">
      <header>
        <h1>SwaPBook</h1>
        <p>Reutiliza • Intercambia • Conoce Libros</p>
      </header>
      <main>
        <Outlet /> {/* Aquí se renderizará Registro */}
      </main>
      <footer className="pie-pagina-autenticacion">
        <div className="enlaces-pie">
          <a href="#">Contratantes</a>
          <a href="#">Políticas</a>
          <a href="#">Quiénes somos</a>
        </div>
        <div className="enlaces-pie">
          <a href="#">Privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Libertas</a>
        </div>
      </footer>
    </div>
  );
};

export default LayoutAutenticacion;