// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './components/auth/Registro';
import Login from './components/auth/Login';
import Clave from './components/auth/Claveolvidada';
import Confirmacion from './components/auth/Confirmacion.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperacion-clave" element={<Clave />} />
        <Route path="/cuenta-activada?" element={<Confirmacion />} />
      </Routes>
    </Router>
  );
}

export default App;