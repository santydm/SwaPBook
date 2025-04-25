// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './components/auth/Registro';
import Login from './components/auth/Login';
import Clave from './components/auth/Claveolvidada';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperacion-clave" element={<Clave />} />
      </Routes>
    </Router>
  );
}

export default App;