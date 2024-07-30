import React, { useEffect, useState } from 'react';
import './ProductCards.css';

const ProductCards = ({ products }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [products]);

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
