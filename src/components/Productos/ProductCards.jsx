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
      {Array.isArray(products) && products.map((product, index) => (
        <div className="product-card" key={index}>
          <img 
            src={product['path-image'] || product.path || 'https://via.placeholder.com/150'} 
            alt={product.name || 'No Image Available'} 
            className="product-image" 
          />
          <h3>{product.name || 'Unnamed Product'}</h3>
          <p>{product.description || 'No description available.'}</p>
          {Array.isArray(product.caracteristicas) && product.caracteristicas.length > 0 && (
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
