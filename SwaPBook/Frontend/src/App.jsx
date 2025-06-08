// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Registro from './components/auth/Registro';
import Login from './components/auth/Login';
import Perfil from './pages/estudiante/Perfil';
import Clave from './components/auth/Claveolvidada';
import Confirmacion from './components/auth/Confirmacion';
import Historial from './pages/estudiante/Historial';
import Catalogo from './components/catalog/Catalogo';
import PublicarLibro from './components/catalog/PublicarLibro';
import Modificar from './pages/estudiante/Perfil';
import Seguridad from './pages/estudiante/Seguridad';
import Mislibros from './pages/estudiante/MisLibros';
import NotificacionesSolicitudes from './components/notificaciones/NotificacionesSolicitudes';
import MisSolicitudes from './pages/estudiante/MisSolicitudes';
import MisIntercambios from './pages/estudiante/MisIntercambios';
import Home from './pages/estudiante/Home';
import RecuperarContrasenia from './components/auth/RecuperarContrasenia';
import RestablecerContrasenia from './components/auth/RestablecerContrasenia';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsuarios from './pages/admin/AdminUsuarios';



function App() {
  const [usuarioLogeado, setUsuarioLogeado] = useState(false);

  useEffect(() => {
    // Verifica si hay un token al montar la app
    setUsuarioLogeado(!!localStorage.getItem('token'));
    // Escucha cambios en el almacenamiento local (por si hay logout/login en otra pestaña)
    const handler = () => setUsuarioLogeado(!!localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Router>
      {usuarioLogeado && <NotificacionesSolicitudes />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperacion-clave" element={<Clave />} />
        <Route path="/cuenta-activada" element={<Confirmacion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/libros" element={<PublicarLibro />} />
        <Route path="/modificar-perfil" element={<Modificar />} />
        <Route path="/mis-libros" element={<Mislibros />} />
        <Route path="/seguridad" element={<Seguridad />} />      
        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />  
        <Route path="/mis-intercambios" element={<MisIntercambios/>} />  
        <Route path="/historial" element={<Historial/>} />  
        <Route path="/recuperacion-clave" element={<RecuperarContrasenia />} />
        <Route path="/restablecer-contrasenia" element={<RestablecerContrasenia />} />
|

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="libros" element={<div>Libros Admin</div>} />
          <Route path="intercambios" element={<div>Intercambios Admin</div>} />
          <Route path="estadisticas" element={<div>Estadísticas Admin</div>} />
        </Route>

        {/* Rutas protegidas */}

      </Routes>
    </Router>
  );
}

export default App;
