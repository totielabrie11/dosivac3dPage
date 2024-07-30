import React, { useState, useEffect } from 'react';
import ProductFilter from './ProductFilter';
import ProductCards from './ProductCards';
import './Productos.css';

function Productos() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product-descriptions');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize filteredProducts with all products
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = (filters) => {
    let filtered = products;
    if (filters.tipoBomba) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.toLowerCase().includes(`tipo de producto: ${filters.tipoBomba.toLowerCase()}`)));
    }
    if (filters.tipoAplicacion) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.toLowerCase().includes(`aplicación: ${filters.tipoAplicacion.toLowerCase()}`)));
    }
    if (filters.tipoIndustria) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.toLowerCase().includes(`industria: ${filters.tipoIndustria.toLowerCase()}`)));
    }
    if (filters.marcaBomba) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.toLowerCase().includes(`marca: ${filters.marcaBomba.toLowerCase()}`)));
    }
    if (filters.materiales) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.toLowerCase().includes(`materiales: ${filters.materiales.toLowerCase()}`)));
    }
    filtered = filtered.filter(p => {
      const presion = parseInt(p.caracteristicas.find(c => c.toLowerCase().includes('presión'))?.match(/\d+/) || 0, 10);
      return presion >= filters.presionMin && presion <= filters.presionMax;
    });
    filtered = filtered.filter(p => {
      const caudal = parseInt(p.caracteristicas.find(c => c.toLowerCase().includes('caudal'))?.match(/\d+/) || 0, 10);
      return caudal >= filters.caudalMin && caudal <= filters.caudalMax;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="productos-container">
      <div className="left-column">
        <ProductFilter onFilter={handleFilter} />
      </div>
      <div className="center-column">
        <ProductCards products={filteredProducts} />
      </div>
    </div>
  );
}

export default Productos;
