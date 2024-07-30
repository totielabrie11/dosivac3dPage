import React, { useState, useEffect } from 'react';
import './ProductFilter.css';  // Asegúrate de que esta línea esté presente

const ProductFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    tipoBomba: '',
    tipoAplicacion: '',
    tipoIndustria: '',
    marcaBomba: '',
    materiales: '',
    presionMin: 0,
    presionMax: 900,
    caudalMin: 0,
    caudalMax: 1200,
  });

  const [tipoProductoOptions, setTipoProductoOptions] = useState([]);
  const [aplicacionOptions, setAplicacionOptions] = useState([]);
  const [allAplicacionOptions, setAllAplicacionOptions] = useState([]);

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
      setAllAplicacionOptions([...tiposDeAplicacion]);
      setAplicacionOptions([...tiposDeAplicacion]);
    } catch (error) {
      console.error('Failed to fetch product descriptions:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (filters.tipoBomba === 'Bomba de vacío') {
      setAplicacionOptions(['Refrigeración', 'Vacío industrial']);
    } else if (filters.tipoBomba === 'soplador') {
      setAplicacionOptions(allAplicacionOptions.filter(option => !['Refrigeración', 'Vacío industrial'].includes(option)));
    } else if (filters.tipoBomba === 'Bomba Dosificadora') {
      setAplicacionOptions(allAplicacionOptions.filter(option => !['Refrigeración', 'Vacío industrial'].includes(option)));
    } else {
      setAplicacionOptions(allAplicacionOptions);
    }
  }, [filters.tipoBomba, allAplicacionOptions]);

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
      {filters.tipoBomba === 'soplador' && (
        <>
          <div className="filter-section">
            <label>Presión mbar, sistema</label>
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
            <label>Caudal (m³/h) entre</label>
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
        </>
      )}
      {filters.tipoBomba === 'Bomba Dosificadora' && (
        <>
          <div className="filter-section">
            <label>Contrapresión en sistema (kg/cm²)</label>
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
            <label>Caudal (lts/h) entre</label>
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
        </>
      )}
    </div>
  );
};

export default ProductFilter;
