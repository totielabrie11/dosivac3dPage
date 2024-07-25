import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductList = ({ setModelPath, setProductDescription, setSelectedProduct, setCharacteristics }) => {
  const [data, setData] = useState(null);
  const [showList, setShowList] = useState(true);
  const [file, setFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/models');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setData({ gltfCount: 0, glbCount: 0, gltfNames: [], glbNames: [] });
    }
  };

  const fetchProductDescription = async (name) => {
    try {
      const response = await fetch('/api/product-descriptions');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const descriptions = await response.json();
      const product = descriptions.find(product => product.name === name);
      if (product) {
        setProductDescription(product.description);
        setSelectedProduct(name);
        setCharacteristics(product.caracteristicas || []);
      } else {
        setProductDescription('No description available for this product.');
        setSelectedProduct(name);
        setCharacteristics([]);
      }
    } catch (error) {
      console.error('Failed to fetch product descriptions:', error);
      setProductDescription('No description available for this product.');
      setSelectedProduct(name);
      setCharacteristics([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Producto subido exitosamente');
        fetchProducts();
      } else {
        alert('No se ha logrado subir el producto');
      }
    } catch (error) {
      console.error('No se ha logrado subir el producto:', error);
      alert('No se ha logrado subir el producto');
    }
  };

  return (
    <div>
      <button onClick={fetchProducts}>Reconocer Productos Instalados</button>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Instalar Nuevo Producto</button>
      </div>
      {data && showList && (
        <div>
          <button onClick={() => setShowList(false)}>Ocultar Lista</button>
          <h3>Total GLTF models found: {data.gltfCount}</h3>
          <ul>
            {data.gltfNames && data.gltfNames.map((model, index) => (
              <li key={index}>
                {index + 1}) {model.name}
                <button onClick={() => { setModelPath(model.path); fetchProductDescription(model.name); }}>
                  Editar
                </button>
                <Link to={`/productos/${model.name}`}>
                  <button>Ver Producto</button>
                </Link>
              </li>
            ))}
          </ul>
          <h3>Total GLB models found: {data.glbCount}</h3>
          <ul>
            {data.glbNames && data.glbNames.map((model, index) => (
              <li key={index}>
                {index + 1}) {model.name}
                <button onClick={() => { setModelPath(model.path); fetchProductDescription(model.name); }}>
                  Editar
                </button>
                <Link to={`/productos/${model.name}`}>
                  <button>Ver Producto</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data && !showList && (
        <button onClick={() => setShowList(true)}>Mostrar Lista</button>
      )}
    </div>
  );
};

export default ProductList;
