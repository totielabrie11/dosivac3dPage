import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import ProductList from './ProductList';
import ProductFilter from './ProductFilter';
import ProductCards from './ProductCards';
import './Productos.css';

const ItemType = {
  CHARACTERISTIC: 'characteristic',
};

const Characteristic = ({ characteristic, index, moveCharacteristic, handleEditCharacteristic, handleDeleteCharacteristic, handleChangeCharacteristic, handleBlurCharacteristic, editingIndex }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CHARACTERISTIC,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.CHARACTERISTIC,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCharacteristic(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className={isDragging ? 'grabbing' : 'grab'}>
      {editingIndex === index ? (
        <input
          type="text"
          value={characteristic}
          onChange={(e) => handleChangeCharacteristic(e, index)}
          onBlur={() => handleBlurCharacteristic(index)}
        />
      ) : (
        <>
          {characteristic}
          <div className="icon-container">
            <span
              className="edit-icon"
              onClick={() => handleEditCharacteristic(index)}
            >
              ✏️
            </span>
            <span
              className="delete-icon"
              onClick={() => handleDeleteCharacteristic(index)}
            >
              🗑️
            </span>
          </div>
        </>
      )}
    </li>
  );
};

function Productos({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const inputRef = useRef(null);
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

  const handleProductClick = (model) => {
    setModelPath(model.path);
    fetchProductDescription(model.name);
    fetchProductSettings(model.name);
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
      setProductDescription('No description available for este producto.');
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

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    let filtered = products;
    // Apply filters to products
    if (newFilters.tipoBomba) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.includes(`Tipo de Producto: ${newFilters.tipoBomba}`)));
    }
    if (newFilters.tipoAplicacion) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.includes(`Aplicación: ${newFilters.tipoAplicacion}`)));
    }
    if (newFilters.tipoIndustria) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.includes(`Industria: ${newFilters.tipoIndustria}`)));
    }
    if (newFilters.marcaBomba) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.includes(`Marca: ${newFilters.marcaBomba}`)));
    }
    if (newFilters.materiales) {
      filtered = filtered.filter(p => p.caracteristicas.some(c => c.includes(`Materiales: ${newFilters.materiales}`)));
    }
    filtered = filtered.filter(p => {
      const presion = parseInt(p.caracteristicas.find(c => c.includes('Presión'))?.match(/\d+/) || 0, 10);
      return presion >= newFilters.presionMin && presion <= newFilters.presionMax;
    });
    filtered = filtered.filter(p => {
      const caudal = parseInt(p.caracteristicas.find(c => c.includes('Caudal'))?.match(/\d+/) || 0, 10);
      return caudal >= newFilters.caudalMin && caudal <= newFilters.caudalMax;
    });
    setFilteredProducts(filtered);
  };

  const moveCharacteristic = (dragIndex, hoverIndex) => {
    const updatedCharacteristics = [...characteristics];
    const [removed] = updatedCharacteristics.splice(dragIndex, 1);
    updatedCharacteristics.splice(hoverIndex, 0, removed);
    setCharacteristics(updatedCharacteristics);
    updateCharacteristics(updatedCharacteristics);
  };

  if (!isAdmin) {
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

export default Productos;
