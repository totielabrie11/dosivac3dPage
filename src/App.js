import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
import ProductAdmin from './components/Productos/ProductAdmin';
import ProductoDetalle from './components/Productos/ProductoDetalle';
import Login from './components/Login';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <Router>
      <div>
        <NavBar isAdmin={isAdmin} user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:name" element={<ProductoDetalle />} />
          {isAdmin && <Route path="/admin/productos" element={<ProductAdmin />} />}
          <Route path="/login" element={<Login setIsAdmin={setIsAdmin} setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
