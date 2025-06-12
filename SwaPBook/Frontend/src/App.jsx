import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminLibros from './pages/admin/AdminLibros';
import AdminIntercambios from './pages/admin/AdminIntercambios';
import AdminEstadisticas from './pages/admin/AdminEstadisticas';

function AppRoutes() {
  const [usuarioLogeado, setUsuarioLogeado] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUsuarioLogeado(!!localStorage.getItem('token'));
    const handler = () => setUsuarioLogeado(!!localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <>
      {/* Notificaciones solo si está logeado y NO en la ruta "/" */}
      {usuarioLogeado && location.pathname !== "/" && <NotificacionesSolicitudes />}
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="libros" element={<AdminLibros />} />
          <Route path="intercambios" element={<AdminIntercambios />} />
          <Route path="estadisticas" element={<AdminEstadisticas />} /> 
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
