// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
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
          <Route path="/productos" element={<Productos isAdmin={isAdmin} />} />
          <Route path="/productos/:name" element={<ProductoDetalle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
