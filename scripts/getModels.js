const fs = require('fs');
const path = require('path');

// Ruta de la carpeta donde se encuentran los modelos
const modelsDir = path.join(__dirname, '..', 'public', 'models');

// Función para contar archivos GLTF/GLB y agregar imágenes JPG/PNG
function getGLTFFiles() {
  let models = [];
  let gltfCount = 0;
  let glbCount = 0;
  let jpgCount = 0;
  let pngCount = 0;
  let gltfNames = [];
  let glbNames = [];
  let jpgNames = [];
  let pngNames = [];

  // Leer el contenido de la carpeta
  const items = fs.readdirSync(modelsDir);

  items.forEach(item => {
    const itemPath = path.join(modelsDir, item);
    const fileExtension = path.extname(item).toLowerCase();

    if (fileExtension === '.gltf' || fileExtension === '.glb' || fileExtension === '.jpg' || fileExtension === '.png') {
      const modelName = path.basename(item, fileExtension);
      const modelPath = `/models/${item}`;
      models.push({ name: modelName, path: modelPath });

      if (fileExtension === '.gltf') {
        gltfCount++;
        gltfNames.push({ name: modelName, path: modelPath });
      } else if (fileExtension === '.glb') {
        glbCount++;
        glbNames.push({ name: modelName, path: modelPath });
      } else if (fileExtension === '.jpg') {
        jpgCount++;
        jpgNames.push({ name: modelName, path: modelPath });
      } else if (fileExtension === '.png') {
        pngCount++;
        pngNames.push({ name: modelName, path: modelPath });
      }
    } else if (fs.lstatSync(itemPath).isDirectory()) {
      const gltfDir = path.join(itemPath, 'glTF');
      if (fs.existsSync(gltfDir) && fs.lstatSync(gltfDir).isDirectory()) {
        const gltfFiles = fs.readdirSync(gltfDir);
        const gltfFile = gltfFiles.find(file => ['.gltf', '.glb'].includes(path.extname(file).toLowerCase()));

        if (gltfFile) {
          const modelName = item;
          const modelPath = `/models/${item}/glTF/${gltfFile}`;
          models.push({ name: modelName, path: modelPath });
          if (path.extname(gltfFile).toLowerCase() === '.gltf') {
            gltfCount++;
            gltfNames.push({ name: modelName, path: modelPath });
          } else {
            glbCount++;
            glbNames.push({ name: modelName, path: modelPath });
          }
        }
      }
    }
  });

  console.log(`Total GLTF models found: ${gltfCount}`);
  console.log(`Total GLB models found: ${glbCount}`);
  console.log(`Total JPG images found: ${jpgCount}`);
  console.log(`Total PNG images found: ${pngCount}`);

  return { models, gltfCount, glbCount, jpgCount, pngCount, gltfNames, glbNames, jpgNames, pngNames };
}

module.exports = getGLTFFiles;
