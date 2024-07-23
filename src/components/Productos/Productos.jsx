import React, { useState } from 'react';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import ProductList from './ProductList';
import './Productos.css';

function Productos() {
  const [modelPath, setModelPath] = useState('/models/car/dosivac/glTF/Dvr new.glb');
  const [productDescription, setProductDescription] = useState('Seleccione un producto para ver su descripción.');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newDescription, setNewDescription] = useState('');

  const updateDescription = async () => {
    if (selectedProduct) {
      const response = await fetch('/api/product-descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedProduct, description: newDescription }),
      });

      if (response.ok) {
        setProductDescription(newDescription);
        setNewDescription('');
      }
    }
  };

  return (
    <div className="productos-container">
      <div className="product-description">
        <h2>Descripción del Producto</h2>
        <p>{productDescription}</p>
        {selectedProduct && (
          <div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Actualizar descripción"
            ></textarea>
            <button onClick={updateDescription}>Actualizar Descripción</button>
          </div>
        )}
        <ProductList setModelPath={setModelPath} setProductDescription={setProductDescription} setSelectedProduct={setSelectedProduct} />
      </div>
      <div className="product-3d">
        <ThreeDCanvas modelPath={modelPath} /> {/* Ajusta la ruta del modelo */}
      </div>
    </div>
  );
}

export default Productos;
