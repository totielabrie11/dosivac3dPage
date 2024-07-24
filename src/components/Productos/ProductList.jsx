import React, { useState } from 'react';

const ProductList = ({ setModelPath, setProductDescription, setSelectedProduct }) => {
  const [data, setData] = useState(null);
  const [showList, setShowList] = useState(true);

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
      } else {
        setProductDescription('No description available for this product.');
        setSelectedProduct(name);
      }
    } catch (error) {
      console.error('Failed to fetch product descriptions:', error);
      setProductDescription('No description available for this product.');
      setSelectedProduct(name);
    }
  };

  return (
    <div>
      <button onClick={fetchProducts}>Reconocer Productos Instalados</button>
      {data && showList && (
        <div>
          <button onClick={() => setShowList(false)}>Ocultar Lista</button>
          <h3>Total GLTF models found: {data.gltfCount}</h3>
          <ul>
            {data.gltfNames && data.gltfNames.map((model, index) => (
              <li key={index} onClick={() => { setModelPath(model.path); fetchProductDescription(model.name); }}>
                {index + 1}) {model.name}
              </li>
            ))}
          </ul>
          <h3>Total GLB models found: {data.glbCount}</h3>
          <ul>
            {data.glbNames && data.glbNames.map((model, index) => (
              <li key={index} onClick={() => { setModelPath(model.path); fetchProductDescription(model.name); }}>
                {index + 1}) {model.name}
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
