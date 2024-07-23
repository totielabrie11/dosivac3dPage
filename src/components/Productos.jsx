// src/components/Productos.jsx
import React from 'react';
import ThreeDCanvas from './ThreeDCanvas';

function Productos() {
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: '1', paddingRight: '20px' }}>
        <h2>Descripción del Producto</h2>
        <p>Esta es la descripción del producto. Aquí puedes agregar más detalles sobre el producto que estás mostrando.</p>
      </div>
      <div style={{ flex: '1' }}>
        <ThreeDCanvas modelPath="/models/car/dosivac/glTF/Dvr new.glb" /> {/* Ajusta la ruta del modelo */}
      </div>
    </div>
  );
}

export default Productos;
