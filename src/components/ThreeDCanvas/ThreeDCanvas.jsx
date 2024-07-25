import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import './ThreeDCanvas.css';
import Loading from '../Productos/Loading';

function Model({ path, rotationSpeed, isAnimating, rotationDirection, ...props }) {
  const { scene, nodes, materials } = useGLTF(path, true);
  const modelRef = useRef();

  useFrame(() => {
    if (isAnimating && modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed * rotationDirection;
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

function ThreeDCanvas({ 
  modelPath, 
  lightIntensity, 
  setLightIntensity, 
  spotLightIntensity, 
  setSpotLightIntensity, 
  lightPosition = [10, 10, 10], 
  setLightPosition, 
  isAnimating, 
  setIsAnimating, 
  rotationSpeed, 
  setRotationSpeed,
  saveSettings 
}) {
  const controlsRef = useRef();
  const [modelError, setModelError] = useState(false);
  const [key, setKey] = useState(Date.now()); // Usar una marca de tiempo para la clave
  const [showControls, setShowControls] = useState(true); // Estado para controlar la visibilidad de los controles
  const [rotationDirection, setRotationDirection] = useState(1); // 1 para derecha, -1 para izquierda

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/product-settings');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const settings = await response.json();
        const productSettings = settings.find(setting => setting.name === modelPath.split('/').pop().split('.')[0]);
        if (productSettings) {
          if (setLightIntensity) setLightIntensity(productSettings.lightIntensity);
          if (setSpotLightIntensity) setSpotLightIntensity(productSettings.spotLightIntensity);
          if (setLightPosition) setLightPosition(productSettings.lightPosition);
          if (setIsAnimating) setIsAnimating(productSettings.isAnimating);
          if (setRotationSpeed) setRotationSpeed(productSettings.rotationSpeed);
        }
      } catch (error) {
        console.error('Failed to fetch product settings:', error);
      }
    };

    fetchSettings();

    if (controlsRef.current) {
      controlsRef.current.reset();
    }

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
    setKey(Date.now());
  };

  useEffect(() => {
    if (saveSettings) saveSettings();
  }, [lightIntensity, spotLightIntensity, lightPosition, isAnimating, rotationSpeed, rotationDirection]);

  return (
    <div className="product-3d">
      <button className="toggle-controls-button" onClick={() => setShowControls(!showControls)}>
        {showControls ? '👁️' : '👁️'}
      </button>
      {showControls && (
        <div className="controls-container">
          <label>
            Light Intensity: 
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={lightIntensity}
              onChange={(e) => setLightIntensity && setLightIntensity(parseFloat(e.target.value))}
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
              onChange={(e) => setSpotLightIntensity && setSpotLightIntensity(parseFloat(e.target.value))}
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
              onChange={(e) => setLightPosition && setLightPosition([parseFloat(e.target.value), lightPosition[1], lightPosition[2]])}
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
              onChange={(e) => setLightPosition && setLightPosition([lightPosition[0], parseFloat(e.target.value), lightPosition[2]])}
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
              onChange={(e) => setLightPosition && setLightPosition([lightPosition[0], lightPosition[1], parseFloat(e.target.value)])}
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
              onChange={(e) => setRotationSpeed && setRotationSpeed(parseFloat(e.target.value))}
            />
          </label>
          <div className="rotation-controls">
            <button onClick={() => setRotationDirection(-1)}>&larr;</button>
            <button onClick={() => setIsAnimating && setIsAnimating(!isAnimating)}>
              {isAnimating ? 'Stop' : 'Play'}
            </button>
            <button onClick={() => setRotationDirection(1)}>&rarr;</button>
          </div>
        </div>
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
            <Model key={modelPath} path={modelPath} rotationSpeed={rotationSpeed} isAnimating={isAnimating} rotationDirection={rotationDirection} position={[0, 0, 0]} scale={0.5} onError={handleError} />
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
