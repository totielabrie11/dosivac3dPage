import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import './ThreeDCanvas.css';
import Loading from '../Productos/Loading';

function Model({ path, rotationSpeed, isAnimating, ...props }) {
  const { scene, nodes, materials } = useGLTF(path, true);
  const modelRef = useRef();

  useFrame(() => {
    if (isAnimating && modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    return () => {
      if (nodes) {
        Object.values(nodes).forEach(node => {
          if (node.dispose) node.dispose();
        });
      }
      if (materials) {
        Object.values(materials).forEach(material => {
          if (material.dispose) material.dispose();
        });
      }
    };
  }, [nodes, materials]);

  return <primitive ref={modelRef} object={scene} {...props} />;
}

function ThreeDCanvas({ modelPath }) {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [spotLightIntensity, setSpotLightIntensity] = useState(1);
  const [lightPosition, setLightPosition] = useState([10, 10, 10]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [showControls, setShowControls] = useState(true);
  const controlsRef = useRef();
  const [modelError, setModelError] = useState(false);
  const [key, setKey] = useState(Date.now()); // Usar una marca de tiempo para la clave

  useEffect(() => {
    setLightIntensity(1);
    setSpotLightIntensity(1);
    setLightPosition([10, 10, 10]);
    setIsAnimating(false);
    setRotationSpeed(0.01);
    setModelError(false);

    if (controlsRef.current) {
      controlsRef.current.reset();
    }

    // Forzar el desmontaje y montaje del componente utilizando una clave única
    setKey(Date.now());
  }, [modelPath]);

  const handleError = () => {
    setModelError(true);
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    console.error('THREE.WebGLRenderer: Context Lost');
  };

  const handleContextRestored = () => {
    console.log('THREE.WebGLRenderer: Context Restored');
    setKey(Date.now()); // Forzar el desmontaje y montaje del componente
  };

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, []);

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
              onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
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
              onChange={(e) => setSpotLightIntensity(parseFloat(e.target.value))}
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
          <label>
            Rotation Speed: 
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
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
        key={key} // Usar la clave única aquí para forzar la recarga
        style={{ height: '100%' }}
        camera={{ position: [0, 0, 2], fov: 60, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={lightPosition} intensity={lightIntensity} />
        <spotLight position={[5, 5, 5]} intensity={spotLightIntensity} angle={0.3} penumbra={1} castShadow />
        <Suspense fallback={<Html><Loading /></Html>}>
          {!modelError ? (
            <Model key={modelPath} path={modelPath} rotationSpeed={rotationSpeed} isAnimating={isAnimating} position={[0, 0, 0]} scale={0.5} onError={handleError} />
          ) : (
            <Html><div>Error al cargar el modelo</div></Html>
          )}
        </Suspense>
        <OrbitControls ref={controlsRef} minDistance={0.1} maxDistance={50} maxPolarAngle={Math.PI} minPolarAngle={0} />
      </Canvas>
    </div>
  );
}

export default ThreeDCanvas;
