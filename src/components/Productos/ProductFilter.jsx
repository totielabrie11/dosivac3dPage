import React, { useState, useEffect } from 'react';
import './productFilter.css';

const ProductFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    tipoBomba: '',
    tipoAplicacion: '',
    tipoIndustria: '',
    marcaBomba: '',
    materiales: '',
    presionMin: 0,
    presionMax: 1241,
    caudalMin: 0,
    caudalMax: 9500,
  });

  const [tipoProductoOptions, setTipoProductoOptions] = useState([]);
  const [aplicacionOptions, setAplicacionOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRangeChange = (e, name) => {
    setFilters({ ...filters, [name]: Number(e.target.value) });
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/product-descriptions');
      const data = await response.json();
      const tiposDeProducto = new Set();
      const tiposDeAplicacion = new Set();
      data.forEach(product => {
        product.caracteristicas.forEach(caracteristica => {
          const tipoMatch = caracteristica.match(/Tipo de Producto: (.*)/i);
          if (tipoMatch) {
            const tipo = tipoMatch[1].trim();
            tiposDeProducto.add(tipo);
          }
          const aplicacionMatch = caracteristica.match(/Aplicación: (.*)/i);
          if (aplicacionMatch) {
            const aplicacion = aplicacionMatch[1].trim();
            tiposDeAplicacion.add(aplicacion);
          }
        });
      });
      setTipoProductoOptions([...tiposDeProducto]);
      setAplicacionOptions([...tiposDeAplicacion]);
    } catch (error) {
      console.error('Failed to fetch product descriptions:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  return (
    <div className="product-filter">
      <h2>Filtrar por:</h2>
      <div className="filter-section">
        <label>Tipo de Producto</label>
        <select name="tipoBomba" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {tipoProductoOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-section">
        <label>Tipo de Aplicación</label>
        <select name="tipoAplicacion" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {aplicacionOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-section">
        <label>Tipo de Industria</label>
        <select name="tipoIndustria" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div className="filter-section">
        <label>Marca de Bomba</label>
        <select name="marcaBomba" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div className="filter-section">
        <label>Materiales</label>
        <select name="materiales" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div className="filter-section">
        <label>Presión (m) entre</label>
        <div className="range-inputs">
          <input
            type="range"
            name="presionMin"
            min="0"
            max="1241"
            value={filters.presionMin}
            onChange={(e) => handleRangeChange(e, 'presionMin')}
          />
          <input
            type="number"
            value={filters.presionMin}
            onChange={(e) => handleRangeChange(e, 'presionMin')}
          />
          <input
            type="number"
            value={filters.presionMax}
            onChange={(e) => handleRangeChange(e, 'presionMax')}
          />
          <input
            type="range"
            name="presionMax"
            min="0"
            max="1241"
            value={filters.presionMax}
            onChange={(e) => handleRangeChange(e, 'presionMax')}
          />
        </div>
      </div>
      <div className="filter-section">
        <label>Caudal (m3/h) entre</label>
        <div className="range-inputs">
          <input
            type="range"
            name="caudalMin"
            min="0"
            max="9500"
            value={filters.caudalMin}
            onChange={(e) => handleRangeChange(e, 'caudalMin')}
          />
          <input
            type="number"
            value={filters.caudalMin}
            onChange={(e) => handleRangeChange(e, 'caudalMin')}
          />
          <input
            type="number"
            value={filters.caudalMax}
            onChange={(e) => handleRangeChange(e, 'caudalMax')}
          />
          <input
            type="range"
            name="caudalMax"
            min="0"
            max="9500"
            value={filters.caudalMax}
            onChange={(e) => handleRangeChange(e, 'caudalMax')}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
