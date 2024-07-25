import React, { useState, useEffect } from 'react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRangeChange = (e, name) => {
    setFilters({ ...filters, [name]: Number(e.target.value) });
  };

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  return (
    <div className="product-filter">
      <h2>Filtrar por:</h2>
      <div>
        <label>Tipo de Bomba</label>
        <select name="tipoBomba" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div>
        <label>Tipo de Aplicación</label>
        <select name="tipoAplicacion" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div>
        <label>Tipo de Industria</label>
        <select name="tipoIndustria" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div>
        <label>Marca de Bomba</label>
        <select name="marcaBomba" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div>
        <label>Materiales</label>
        <select name="materiales" onChange={handleChange}>
          <option value="">Seleccionar</option>
          {/* Agregar opciones según la base de datos */}
        </select>
      </div>
      <div>
        <label>Presión (m) entre</label>
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
      <div>
        <label>Caudal (m3/h) entre</label>
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
  );
};

export default ProductFilter;
