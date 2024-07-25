import React from 'react';
import './ProductCards.css';

const products = [
  {
    name: 'Honda CBR500R',
    description: 'A sporty bike with great performance.',
    features: ['Engine: 471cc', 'Power: 47 hp', 'Weight: 192 kg', 'Color: Red'],
    image: 'https://example.com/honda-cbr500r.jpg'
  },
  {
    name: 'Yamaha YZF-R3',
    description: 'A compact, lightweight supersport bike.',
    features: ['Engine: 321cc', 'Power: 42 hp', 'Weight: 169 kg', 'Color: Blue'],
    image: 'https://example.com/yamaha-yzf-r3.jpg'
  },
  {
    name: 'Kawasaki Ninja 400',
    description: 'A perfect entry-level bike with great performance.',
    features: ['Engine: 399cc', 'Power: 45 hp', 'Weight: 168 kg', 'Color: Green'],
    image: 'https://example.com/kawasaki-ninja-400.jpg'
  },
  {
    name: 'Ducati Panigale V2',
    description: 'An Italian masterpiece with stunning looks and performance.',
    features: ['Engine: 955cc', 'Power: 155 hp', 'Weight: 176 kg', 'Color: Red'],
    image: 'https://example.com/ducati-panigale-v2.jpg'
  },
  {
    name: 'BMW S1000RR',
    description: 'A superbike with advanced technology and performance.',
    features: ['Engine: 999cc', 'Power: 207 hp', 'Weight: 197 kg', 'Color: White'],
    image: 'https://example.com/bmw-s1000rr.jpg'
  },
  {
    name: 'Suzuki GSX-R750',
    description: 'A legendary sportbike with great handling.',
    features: ['Engine: 750cc', 'Power: 148 hp', 'Weight: 190 kg', 'Color: Blue'],
    image: 'https://example.com/suzuki-gsx-r750.jpg'
  }
];

const ProductCards = () => {
  return (
    <div className="product-cards-container">
      {products.map((product, index) => (
        <div className="product-card" key={index}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <ul>
            {product.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
