const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const getGLTFFiles = require('./scripts/getModels');

const app = express();
const port = process.env.PORT || 5000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const productosDescriptionPath = path.join(dataDir, 'productosDescription.json');
if (!fs.existsSync(productosDescriptionPath)) {
  fs.writeFileSync(productosDescriptionPath, JSON.stringify([]));
}

const setterProductPath = path.join(dataDir, 'setterProduct.json');
if (!fs.existsSync(setterProductPath)) {
  fs.writeFileSync(setterProductPath, JSON.stringify([]));
}

const productOrderPath = path.join(dataDir, 'productOrder.json');
if (!fs.existsSync(productOrderPath)) {
  fs.writeFileSync(productOrderPath, JSON.stringify([]));
}

const usersPath = path.join(dataDir, 'us.json');
if (!fs.existsSync(usersPath)) {
  fs.writeFileSync(usersPath, JSON.stringify([]));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'models'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

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

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha podido subir el producto' });
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  const validExtensions = ['.glb', '.gltf', '.jpg', '.png'];

  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({ message: 'Tipo de archivo no soportado' });
  }

  const modelName = req.body.name || path.basename(req.file.originalname, fileExtension); // Obtener el nombre del producto del body si está disponible
  const modelPath = `/models/${req.file.originalname}`;

  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  const existingProduct = descriptions.find(product => product.name.toLowerCase() === modelName.toLowerCase());

  if (existingProduct) {
    if (fileExtension === '.jpg' || fileExtension === '.png') {
      existingProduct['path-image'] = modelPath;
    } else {
      existingProduct.path = modelPath;
    }
  } else {
    const newProduct = { name: modelName, description: '', path: modelPath, caracteristicas: [] };
    if (fileExtension === '.jpg' || fileExtension === '.png') {
      newProduct['path-image'] = modelPath;
    }
    descriptions.push(newProduct);
  }

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));

  const order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  if (!order.includes(modelName.toLowerCase())) {
    order.push(modelName.toLowerCase());
  }
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));

  res.status(200).json({ message: 'Producto subido exitosamente', file: req.file });
});

function registerProducts(models) {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  let order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  const uniqueProducts = new Map();

  models.forEach(model => {
    if (!uniqueProducts.has(model.name)) {
      uniqueProducts.set(model.name, model);
    } else {
      const existingProduct = uniqueProducts.get(model.name);
      if (model.path.endsWith('.jpg') || model.path.endsWith('.png')) {
        existingProduct['path-image'] = model.path;
      }
    }
  });

  const uniqueModels = Array.from(uniqueProducts.values());

  uniqueModels.forEach(model => {
    const existingProduct = descriptions.find(product => product.name === model.name);
    if (existingProduct) {
      if (model.path.endsWith('.jpg') || model.path.endsWith('.png')) {
        existingProduct['path-image'] = model.path;
      } else {
        existingProduct.path = model.path;
      }
    } else {
      const newProduct = { name: model.name, description: '', path: model.path, caracteristicas: [] };
      if (model.path.endsWith('.jpg') || model.path.endsWith('.png')) {
        newProduct['path-image'] = model.path;
      }
      descriptions.push(newProduct);
      if (!order.includes(model.name)) {
        order.push(model.name);
      }
    }
  });

  fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));
}

app.get('/api/models', (req, res) => {
  const result = getGLTFFiles();
  registerProducts(result.models);
  res.json(result);
});

app.get('/api/product-descriptions', (req, res) => {
  const descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  res.json(descriptions);
});

app.get('/api/product-order', (req, res) => {
  const order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  res.json(order);
});

app.post('/api/product-order', (req, res) => {
  const { order } = req.body;
  fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));
  res.json({ success: true });
});

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

app.get('/api/product-settings', (req, res) => {
  const settings = JSON.parse(fs.readFileSync(setterProductPath, 'utf8'));
  res.json(settings);
});

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

app.post('/api/edit-product-name', (req, res) => {
  const { oldName, newName } = req.body;

  // Obtener las extensiones de los archivos actuales
  let descriptions = JSON.parse(fs.readFileSync(productosDescriptionPath, 'utf8'));
  const existingProduct = descriptions.find(product => product.name === oldName);
  if (!existingProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const oldFilePath = path.join(__dirname, 'public', 'models', path.basename(existingProduct.path));
  const fileExtension = path.extname(oldFilePath);
  const newFilePath = path.join(__dirname, 'public', 'models', `${newName}${fileExtension}`);

  // Renombrar el archivo en el sistema de archivos
  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error renaming file', error: err });
    }

    // Actualizar productOrder.json
    let order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
    order = order.map(name => (name === oldName ? newName : name));
    fs.writeFileSync(productOrderPath, JSON.stringify(order, null, 2));

    // Actualizar productosDescription.json
    let duplicateProduct = descriptions.find(product => product.name === newName);

    if (existingProduct && !duplicateProduct) {
      existingProduct.name = newName;
      existingProduct.path = `/models/${newName}${fileExtension}`;
    } else if (existingProduct && duplicateProduct) {
      // Merge characteristics if the new name already exists
      duplicateProduct.description = existingProduct.description || duplicateProduct.description;
      duplicateProduct.path = existingProduct.path || duplicateProduct.path;
      duplicateProduct.caracteristicas = [
        ...new Set([...duplicateProduct.caracteristicas, ...existingProduct.caracteristicas])
      ];
      descriptions = descriptions.filter(product => product.name !== oldName);
    }

    fs.writeFileSync(productosDescriptionPath, JSON.stringify(descriptions, null, 2));

    // Actualizar setterProduct.json
    let settings = JSON.parse(fs.readFileSync(setterProductPath, 'utf8'));
    settings = settings.map(setting => {
      if (setting.name === oldName) {
        return { ...setting, name: newName };
      }
      return setting;
    });
    fs.writeFileSync(setterProductPath, JSON.stringify(settings, null, 2));

    res.json({ success: true });
  });
});

// Nueva ruta para limpiar duplicados en productOrder.json
app.get('/api/clean-product-order', (req, res) => {
  let order = JSON.parse(fs.readFileSync(productOrderPath, 'utf8'));
  const uniqueOrder = Array.from(new Set(order));
  fs.writeFileSync(productOrderPath, JSON.stringify(uniqueOrder, null, 2));
  res.json({ success: true, order: uniqueOrder });
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
