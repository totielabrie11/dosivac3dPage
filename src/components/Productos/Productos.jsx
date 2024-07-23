import React from 'react';
import ThreeDCanvas from '../ThreeDCanvas/ThreeDCanvas';
import './Productos.css';

function Productos() {
  return (
    <div className="productos-container">
      <div className="product-description">
        <h2>Descripción del Producto</h2>
        <p>Esta es la descripción del producto. Aquí puedes agregar más detalles sobre el producto que estás mostrando.</p>
      </div>
      <div className="product-3d">
        <ThreeDCanvas modelPath="/models/car/dosivac/glTF/Dvr new.glb" /> {/* Ajusta la ruta del modelo */}
      </div>
    </div>
  );
}

export default Productos;
