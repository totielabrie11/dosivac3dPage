import React, { useState, useEffect } from 'react';
import ProductFilter from './ProductFilter';
import ProductCards from './ProductCards';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product-descriptions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilter = (filters) => {
    setFilters(filters);
  };

  return (
    <div>
      <ProductFilter onFilter={handleFilter} />
      <ProductCards products={products} filters={filters} />
    </div>
  );
};

export default ProductPage;
