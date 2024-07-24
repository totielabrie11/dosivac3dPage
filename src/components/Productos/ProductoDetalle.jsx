import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import Loading from '../Productos/Loading';
import './ProductoDetalle.css';

function ProductoDetalle() {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${name}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [name]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="productos-container">
      <div className="product-description">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>Características:</h3>
        <ol>
          <li>Potencia: 2.5 HP</li>
          <li>Material: Aluminio reforzado</li>
          <li>Capacidad: 200 litros</li>
          <li>Velocidad máxima: 3000 RPM</li>
          <li>Consumo energético: 1.2 kWh</li>
        </ol>
      </div>
      <div className="product-3d">
        <ThreeDCanvas modelPath={product.path} />
      </div>
    </div>
  );
}

export default ProductoDetalle;
