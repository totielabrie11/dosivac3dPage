const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const getGLTFFiles = require('./scripts/getModels');

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

// Crear el archivo 'setterProduct.json' si no existe
const setterProductPath = path.join(dataDir, 'setterProduct.json');
if (!fs.existsSync(setterProductPath)) {
  fs.writeFileSync(setterProductPath, JSON.stringify([]));
}

// Crear el archivo 'productOrder.json' si no existe
const productOrderPath = path.join(dataDir, 'productOrder.json');
if (!fs.existsSync(productOrderPath)) {
  fs.writeFileSync(productOrderPath, JSON.stringify([]));
}

// Crear el archivo 'us.json' si no existe
const usersPath = path.join(dataDir, 'us.json');
if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, JSON.stringify([]));
}

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Configurar Multer para almacenar archivos en la carpeta 'public/models'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'models'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para verificar credenciales
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ success: true, username: user.username, role: user.role });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Ruta para cargar un nuevo archivo GLB
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha podido subir el producto' });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const validExtensions = ['.glb', '.gltf', '.jpg', '.png'];

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({ message: 'Tipo de archivo no soportado' });
  }

  const modelName = path.basename(req.file.originalname, fileExtension);
  const modelPath = `/models/${req.file.originalname}`;

  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  const existingProduct = descriptions.find(product => product.name === modelName);

  if (existingProduct) {
    existingProduct.path = modelPath;
  } else {
    descriptions.push({ name: modelName, description: '', path: modelPath, caracteristicas: [] });
  }

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));

  // Agregar el nuevo producto al final del orden si no existe
  const order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  if (!order.includes(modelName)) {
    order.push(modelName);
  }
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));

  res.status(200).json({ message: 'Producto subido exitosamente', file: req.file });
});

// Función para registrar productos automáticamente
function registerProducts(models) {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  const order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));

  models.forEach(model => {
    const existingProduct = descriptions.find(product => product.name === model.name);
    if (existingProduct) {
      existingProduct.path = model.path;
    } else {
      descriptions.push({ name: model.name, description: '', path: model.path, caracteristicas: [] });
      if (!order.includes(model.name)) {
        order.push(model.name);
      }
    }
  });

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));
}

// API endpoint para obtener modelos y registrar productos automáticamente
app.get('/api/models', (req, res) => {
  const result = getGLTFFiles();
  registerProducts(result.models);
  res.json(result);
});

// API endpoint para obtener las descripciones de productos
app.get('/api/product-descriptions', (req, res) => {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  res.json(descriptions);
});

// API endpoint para obtener el orden de los productos
app.get('/api/product-order', (req, res) => {
  const order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  res.json(order);
});

// API endpoint para actualizar el orden de los productos
app.post('/api/product-order', (req, res) => {
  const { order } = req.body;
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));
  res.json({ success: true });
});

// API endpoint para actualizar la descripción de un producto
app.post('/api/product-descriptions', (req, res) => {
  const { name, description } = req.body;
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));

  const existingProduct = descriptions.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.description = description;
  } else {
    descriptions.push({ name, description, caracteristicas: [] });
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

// API endpoint para actualizar la configuración de un producto
app.post('/api/product-settings', (req, res) => {
  const { name, lightIntensity, spotLightIntensity, lightPosition, isAnimating, rotationSpeed } = req.body;
  const settings = JSON.parse(fs.readFileSync(setterProductPath, 'utf8'));

  const existingProduct = settings.find(product => product.name === name);
  if (existingProduct) {
    existingProduct.lightIntensity = lightIntensity;
    existingProduct.spotLightIntensity = spotLightIntensity;
    existingProduct.lightPosition = lightPosition;
    existingProduct.isAnimating = isAnimating;
    existingProduct.rotationSpeed = rotationSpeed;
  } else {
    settings.push({ name, lightIntensity, spotLightIntensity, lightPosition, isAnimating, rotationSpeed });
  }

  fs.writeFileSync(setterProductPath, JSON.stringify(settings, null, 2));
  res.json({ success: true });
});

// API endpoint para obtener la configuración de los productos
app.get('/api/product-settings', (req, res) => {
  const settings = JSON.parse(fs.readFileSync(setterProductPath, 'utf8'));
  res.json(settings);
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
