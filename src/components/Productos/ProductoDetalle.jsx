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
    <div className="producto-detalle">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <ThreeDCanvas modelPath={product.path} />
    </div>
  );
}

export default ProductoDetalle;
