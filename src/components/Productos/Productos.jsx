import React, { useState, useRef, useEffect } from 'react';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import ProductList from './ProductList';
import './Productos.css';

function Productos() {
  const [modelPath, setModelPath] = useState('/models/car/dosivac/glTF/Dvr new.glb');
  const [productDescription, setProductDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [characteristics, setCharacteristics] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    if (isEditingDescription && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingDescription]);

  const updateDescription = async () => {
    if (selectedProduct) {
      const response = await fetch('/api/product-descriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedProduct, description: productDescription }),
      });

      if (response.ok) {
        setIsEditingDescription(false);
      }
    }
  };

  const updateCharacteristics = async (updatedCharacteristics) => {
    if (selectedProduct) {
      const response = await fetch('/api/product-characteristics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedProduct, characteristics: updatedCharacteristics }),
      });

      if (response.ok) {
        setNewCharacteristic('');
      }
    }
  };

  const handleAddCharacteristic = () => {
    const updatedCharacteristics = [...characteristics, newCharacteristic];
    setCharacteristics(updatedCharacteristics);
    setNewCharacteristic('');
    updateCharacteristics(updatedCharacteristics);
  };

  const handleRemoveCharacteristic = () => {
    const updatedCharacteristics = characteristics.slice(0, -1);
    setCharacteristics(updatedCharacteristics);
    updateCharacteristics(updatedCharacteristics);
  };

  const handleEditCharacteristic = (index) => {
    setEditingIndex(index);
  };

  const handleChangeCharacteristic = (event, index) => {
    const updatedCharacteristics = characteristics.map((char, i) => (
      i === index ? event.target.value : char
    ));
    setCharacteristics(updatedCharacteristics);
  };

  const handleBlurCharacteristic = (index) => {
    setEditingIndex(null);
    updateCharacteristics(characteristics);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleBlurDescription = () => {
    setIsEditingDescription(false);
    updateDescription();
  };

  const handleProductClick = (model) => {
    setModelPath(model.path);
    fetchProductDescription(model.name);
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

  return (
    <div className="productos-container">
      <div className="product-list">
        <ProductList
          setModelPath={setModelPath}
          setProductDescription={setProductDescription}
          setSelectedProduct={setSelectedProduct}
          setCharacteristics={setCharacteristics}
          handleProductClick={handleProductClick}
        />
      </div>
      <div className="product-3d">
        <ThreeDCanvas modelPath={modelPath} />
      </div>
      {selectedProduct && (
        <div className="product-description">
          <h2>Descripción del Producto</h2>
          {isEditingDescription ? (
            <textarea
              ref={inputRef}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              onBlur={handleBlurDescription}
            />
          ) : (
            <p>
              {productDescription}
              <span
                className="edit-icon"
                onClick={handleEditDescription}
              >
                ✏️
              </span>
            </p>
          )}
          <div>
            <h3>Características</h3>
            <ul>
              {characteristics.map((char, index) => (
                <li key={index}>
                  {editingIndex === index ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={char}
                      onChange={(e) => handleChangeCharacteristic(e, index)}
                      onBlur={() => handleBlurCharacteristic(index)}
                    />
                  ) : (
                    <>
                      {char}
                      <span
                        className="edit-icon"
                        onClick={() => handleEditCharacteristic(index)}
                      >
                        ✏️
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              placeholder="Nueva característica"
            />
            <button onClick={handleAddCharacteristic}>Agregar Característica</button>
            <button onClick={handleRemoveCharacteristic}>Quitar Última Característica</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
