// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './components/auth/Registro';
import Login from './components/auth/Login';
import Clave from './components/auth/Claveolvidada';
import Confirmacion from './components/auth/Confirmacion';
import Perfil from './pages/estudiante/Perfil';
import Catalogo from './components/catalog/Catalogo';
import PublicarLibro from './components/catalog/PublicarLibro';
import Modificar from './pages/estudiante/ModificarPerfil';
import Seguridad from './pages/estudiante/Seguridad';
import Mislibros from './pages/estudiante/MisLibros';



function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;