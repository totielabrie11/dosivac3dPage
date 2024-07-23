import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './ThreeDCanvas.css';

function Model({ path, isAnimating, ...props }) {
  const { scene } = useGLTF(path);
  const modelRef = useRef();

  useFrame(() => {
    if (isAnimating && modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Ajuste la rotación en el eje Y
    }
  });

  return <primitive ref={modelRef} object={scene} {...props} />;
}

function ThreeDCanvas({ modelPath }) {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [spotLightIntensity, setSpotLightIntensity] = useState(1);
  const [lightPosition, setLightPosition] = useState([10, 10, 10]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showControls, setShowControls] = useState(true); // Nuevo estado para controlar la visibilidad de los controles

  return (
    <div className="product-3d">
      {showControls && (
        <div className="controls-container">
          <button className="close-button" onClick={() => setShowControls(false)}>✖</button>
          <label>
            Light Intensity: 
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(e.target.value)}
            />
          </label>
          <label>
            Spot Light Intensity: 
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={spotLightIntensity}
              onChange={(e) => setSpotLightIntensity(e.target.value)}
            />
          </label>
          <label>
            Light X: 
            <input
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={lightPosition[0]}
              onChange={(e) => setLightPosition([parseFloat(e.target.value), lightPosition[1], lightPosition[2]])}
            />
          </label>
          <label>
            Light Y: 
            <input
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={lightPosition[1]}
              onChange={(e) => setLightPosition([lightPosition[0], parseFloat(e.target.value), lightPosition[2]])}
            />
          </label>
          <label>
            Light Z: 
            <input
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={lightPosition[2]}
              onChange={(e) => setLightPosition([lightPosition[0], lightPosition[1], parseFloat(e.target.value)])}
            />
          </label>
          <button onClick={() => setIsAnimating(!isAnimating)}>
            {isAnimating ? 'Stop' : 'Play'}
          </button>
        </div>
      )}
      {!showControls && (
        <button className="show-button" onClick={() => setShowControls(true)}>👁️</button>
      )}
      <Canvas
        style={{ height: '100%' }}
        camera={{ position: [0, 0, 2], fov: 60, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={lightPosition} intensity={lightIntensity} />
        <spotLight position={[5, 5, 5]} intensity={spotLightIntensity} angle={0.3} penumbra={1} castShadow />
        <Suspense fallback={null}>
          <Model path={modelPath} isAnimating={isAnimating} position={[0, 0, 0]} scale={0.5} />
        </Suspense>
        <OrbitControls minDistance={0.1} maxDistance={50} maxPolarAngle={Math.PI} minPolarAngle={0} />
      </Canvas>
    </div>
  );
}

export default ThreeDCanvas;
