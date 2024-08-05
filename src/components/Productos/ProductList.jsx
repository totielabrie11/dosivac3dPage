import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ setModelPath, setProductDescription, setSelectedProduct, setCharacteristics }) => {
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState(true);
  const [file, setFile] = useState(null);
  const [order, setOrder] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchProducts = useCallback(async (order) => {
    try {
      const response = await fetch('/api/models');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const combinedProducts = [
        ...result.models
      ];

      const orderedProducts = combinedProducts.slice().sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
      setData(orderedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setData([]);
    }
  }, []);

  const fetchProductOrder = useCallback(async () => {
    try {
      const response = await fetch('/api/product-order');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const order = await response.json();
      setOrder(order);
      fetchProducts(order);
    } catch (error) {
      console.error('Failed to fetch product order:', error);
    }
  }, [fetchProducts]);

  const cleanProductOrder = useCallback(async () => {
    try {
      const response = await fetch('/api/clean-product-order');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setOrder(result.order);
      fetchProducts(result.order);
    } catch (error) {
      console.error('Failed to clean product order:', error);
    }
  }, [fetchProducts]);

  useEffect(() => {
    cleanProductOrder(); // Limpiar duplicados al montar el componente
  }, [cleanProductOrder]);

  const saveProductOrder = async (order) => {
    try {
      const response = await fetch('/api/product-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to save product order:', error);
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
        fetchProductOrder();
      } else {
        alert('No se ha logrado subir el producto');
      }
    } catch (error) {
      console.error('No se ha logrado subir el producto:', error);
      alert('No se ha logrado subir el producto');
    }
  };

  const moveProductUp = (index) => {
    if (index === 0) return;
    const updatedData = [...data];
    [updatedData[index - 1], updatedData[index]] = [updatedData[index], updatedData[index - 1]];
    setData(updatedData);
    updateOrder(updatedData);
  };

  const moveProductDown = (index) => {
    const updatedData = [...data];
    if (index === updatedData.length - 1) return;
    [updatedData[index + 1], updatedData[index]] = [updatedData[index], updatedData[index + 1]];
    setData(updatedData);
    updateOrder(updatedData);
  };

  const updateOrder = (updatedData) => {
    const updatedOrder = updatedData.map(product => product.name);
    setOrder(updatedOrder);
    saveProductOrder(updatedOrder);
  };

  const handleEditClick = (index, name) => {
    setEditIndex(index);
    setEditName(name);
  };

  const handleEditChange = (e) => {
    setEditName(e.target.value);
  };

  const handleEditSave = async () => {
    const updatedData = [...data];
    const oldName = updatedData[editIndex].name;
    updatedData[editIndex].name = editName;
    setData(updatedData);
    setEditIndex(null);
    setEditName("");

    try {
      const response = await fetch('/api/edit-product-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldName, newName: editName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Failed to update product name:', error);
    }
  };

  const renderProductList = (products) => {
    const orderedProducts = products.slice().sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    return (
      <ul className="product-list">
        {orderedProducts.map((model, index) => (
          <li key={index} className="product-list-item">
            {editIndex === index ? (
              <input
                type="text"
                value={editName}
                onChange={handleEditChange}
                onBlur={handleEditSave}
                autoFocus
              />
            ) : (
              <span className="product-name">{index + 1}) {model.name}</span>
            )}
            <div className="product-actions">
              <button className="btn-edit" onClick={() => { setModelPath(model.path); fetchProductDescription(model.name); }}>
                Editar
              </button>
              <Link to={`/productos/${model.name}`}>
                <button className="btn-view">Ver Producto</button>
              </Link>
              <button className="btn-move" onClick={() => moveProductUp(index)}>⬆️</button>
              <button className="btn-move" onClick={() => moveProductDown(index)}>⬇️</button>
              <button className="btn-edit-name" onClick={() => handleEditClick(index, model.name)}>✏️</button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <button onClick={cleanProductOrder}>Reconocer Productos Instalados</button>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Instalar Nuevo Producto</button>
      </div>
      {data.length > 0 && showList && (
        <div>
          <button onClick={() => setShowList(false)}>Ocultar Lista</button>
          {renderProductList(data)}
        </div>
      )}
      {data.length > 0 && !showList && (
        <button onClick={() => setShowList(true)}>Mostrar Lista</button>
      )}
    </div>
  );
};

export default ProductList;
