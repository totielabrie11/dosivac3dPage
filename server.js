const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Crear la carpeta 'data' si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Crear el archivo 'productosDescription.json' si no existe
const productosDescriptionPath = path.join(dataDir, 'productosDescription.json');
if (!fs.existsSync(productosDescriptionPath)) {
  fs.writeFileSync(productosDescriptionPath, JSON.stringify([]));
}

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Función para registrar productos automáticamente
function registerProducts(models) {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  models.forEach(model => {
    if (!descriptions.some(product => product.name === model.name)) {
      descriptions.push({ name: model.name, description: '' });
    }
  });
  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));
}

// API endpoint para obtener las descripciones de productos
app.get('/api/product-descriptions', (req, res) => {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  res.json(descriptions);
});

// API endpoint para actualizar la descripción de un producto
app.post('/api/product-descriptions', (req, res) => {
  const { name, description } = req.body;
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));

  const existingProduct = descriptions.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.description = description;
  } else {
    descriptions.push({ name, description });
  }

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));
  res.json({ success: true });
});

// API endpoint para actualizar las características de un producto
app.post('/api/product-characteristics', (req, res) => {
  const { name, characteristics } = req.body;
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));

  const existingProduct = descriptions.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.caracteristicas = characteristics;
  } else {
    descriptions.push({ name, description: '', caracteristicas: characteristics });
  }

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));
  res.json({ success: true });
});


// API endpoint para obtener modelos y registrar productos automáticamente
app.get('/api/models', (req, res) => {
  const getGLTFFiles = require('./scripts/getModels');
  const result = getGLTFFiles();
  registerProducts(result.models);
  res.json(result);
});

// API endpoint para obtener un producto por su nombre
app.get('/api/product/:name', (req, res) => {
  const name = req.params.name;
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  const product = descriptions.find(product => product.name === name);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});


// Servir los archivos estáticos de React
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
