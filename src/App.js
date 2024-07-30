import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
import ProductAdmin from './components/Productos/ProductAdmin';
import ProductoDetalle from './components/Productos/ProductoDetalle';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <Router>
      <div>
        <NavBar isAdmin={isAdmin} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home setIsAdmin={setIsAdmin} />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:name" element={<ProductoDetalle />} />
          {isAdmin && <Route path="/admin/productos" element={<ProductAdmin />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
