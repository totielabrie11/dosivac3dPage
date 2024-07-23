// src/component/ModelSelector.jsx
import React from 'react';

function ModelSelector({ models, currentModel, onChange }) {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
      <select value={currentModel} onChange={e => onChange(e.target.value)}>
        {models.map(model => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModelSelector;


