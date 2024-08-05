import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import ProductList from './ProductList';
import Characteristic from './Characteristic';
import './Productos.css';

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [modelPath, setModelPath] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newCharacteristic, setNewCharacteristic] = useState('');
  const [characteristics, setCharacteristics] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [spotLightIntensity, setSpotLightIntensity] = useState(1);
  const [lightPosition, setLightPosition] = useState([10, 10, 10]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const inputRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/product-descriptions');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const updateSettings = async () => {
    if (selectedProduct) {
      const response = await fetch('/api/product-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: selectedProduct, 
          lightIntensity, 
          spotLightIntensity, 
          lightPosition, 
          isAnimating, 
          rotationSpeed 
        }),
      });

      if (response.ok) {
        console.log('Settings saved');
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

  const handleDeleteCharacteristic = (index) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta característica?')) {
      const updatedCharacteristics = characteristics.filter((_, i) => i !== index);
      setCharacteristics(updatedCharacteristics);
      updateCharacteristics(updatedCharacteristics);
    }
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleBlurDescription = () => {
    setIsEditingDescription(false);
    updateDescription();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'jpg' || fileExtension === 'png') {
      setImageFile(file);
    } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
      setModelFile(file);
    } else {
      alert('Tipo de archivo no soportado');
    }
  };

  const handleUpload = async () => {
    if (!selectedProduct) return;

    const uploadFile = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', selectedProduct);

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

    if (imageFile) await uploadFile(imageFile);
    if (modelFile) await uploadFile(modelFile);

    setImageFile(null);
    setModelFile(null);
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

  const fetchProductSettings = async (name) => {
    try {
      const response = await fetch('/api/product-settings');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const settings = await response.json();
      const productSettings = settings.find(setting => setting.name === name);
      if (productSettings) {
        setLightIntensity(productSettings.lightIntensity);
        setSpotLightIntensity(productSettings.spotLightIntensity);
        setLightPosition(productSettings.lightPosition || [10, 10, 10]);
        setIsAnimating(productSettings.isAnimating);
        setRotationSpeed(productSettings.rotationSpeed);
      } else {
        setLightIntensity(1);
        setSpotLightIntensity(1);
        setLightPosition([10, 10, 10]);
        setIsAnimating(false);
        setRotationSpeed(0.01);
      }
    } catch (error) {
      console.error('Failed to fetch product settings:', error);
      setLightIntensity(1);
      setSpotLightIntensity(1);
      setLightPosition([10, 10, 10]);
      setIsAnimating(false);
      setRotationSpeed(0.01);
    }
  };

  const moveCharacteristic = (dragIndex, hoverIndex) => {
    const updatedCharacteristics = [...characteristics];
    const [removed] = updatedCharacteristics.splice(dragIndex, 1);
    updatedCharacteristics.splice(hoverIndex, 0, removed);
    setCharacteristics(updatedCharacteristics);
    updateCharacteristics(updatedCharacteristics);
  };

  const handleProductClick = (model) => {
    setModelPath(model.path);
    fetchProductDescription(model.name);
    fetchProductSettings(model.name);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="productos-container">
        <div className="left-column">
          <ProductList
            setModelPath={setModelPath}
            setProductDescription={setProductDescription}
            setSelectedProduct={setSelectedProduct}
            setCharacteristics={setCharacteristics}
            handleProductClick={handleProductClick}
          />
        </div>
        <div className="center-column">
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
                    <Characteristic
                      key={index}
                      characteristic={char}
                      index={index}
                      moveCharacteristic={moveCharacteristic}
                      handleEditCharacteristic={handleEditCharacteristic}
                      handleDeleteCharacteristic={handleDeleteCharacteristic}
                      handleChangeCharacteristic={handleChangeCharacteristic}
                      handleBlurCharacteristic={handleBlurCharacteristic}
                      editingIndex={editingIndex}
                    />
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
              <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Subir Imagen/Modelo</button>
              </div>
            </div>
          )}
        </div>
        <div className="right-column">
          {modelPath ? (
            <ThreeDCanvas 
              modelPath={modelPath}
              lightIntensity={lightIntensity}
              setLightIntensity={setLightIntensity}
              spotLightIntensity={spotLightIntensity}
              setSpotLightIntensity={setSpotLightIntensity}
              lightPosition={lightPosition}
              setLightPosition={setLightPosition}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              rotationSpeed={rotationSpeed}
              setRotationSpeed={setRotationSpeed}
              saveSettings={updateSettings}
            />
          ) : (
            <div>A la espera de mostrar un producto 3D</div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default ProductAdmin;
