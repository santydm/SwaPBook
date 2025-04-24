// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './components/auth/Registro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;