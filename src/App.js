import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home/Home';
import Productos from './components/Productos/Productos';
import ProductoDetalle from './components/Productos/ProductoDetalle';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:name" element={<ProductoDetalle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
