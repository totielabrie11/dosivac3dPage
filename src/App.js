// src/App.jsx
import React, { useState, useEffect } from 'react';
import ThreeDCanvas from './component/ThreeDCanvas';
import ModelSelector from './component/ModelSelector';
import models from './models.json';

function App() {
  const [currentModel, setCurrentModel] = useState(models[0]);

  const getModelPath = (modelName) => {
    const model = models.find(m => m.name === modelName);
    return model ? model.path : '';
  };

  useEffect(() => {
    if (models.length > 0) {
      setCurrentModel(models[0].name);
    }
  }, []);

  return (
    <div className="App">
      <ModelSelector models={models} currentModel={currentModel} onChange={setCurrentModel} />
      <ThreeDCanvas modelPath={getModelPath(currentModel)} />
    </div>
  );
}

export default App;
