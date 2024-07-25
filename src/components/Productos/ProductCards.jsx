import React, { useEffect, useState } from 'react';
import './ProductCards.css';

const ProductCards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product-descriptions');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-cards-container">
      {products.map((product, index) => (
        <div className="product-card" key={index}>
          <img 
            src={product.image || 'https://via.placeholder.com/150'} 
            alt={product.name} 
            className="product-image" 
          />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          {product.caracteristicas && (
            <ul>
              {product.caracteristicas.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
