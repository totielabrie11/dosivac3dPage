const fs = require('fs');
const path = require('path');

// Ruta de la carpeta donde se encuentran los modelos
const modelsDir = path.join(__dirname, '..', 'public', 'models', 'car');

// Función para contar archivos GLTF/GLB
function getGLTFFiles() {
  let models = [];
  let gltfCount = 0;
  let glbCount = 0;
  let gltfNames = [];
  let glbNames = [];

  // Leer el contenido de la carpeta
  const items = fs.readdirSync(modelsDir);

  items.forEach(item => {
    const itemPath = path.join(modelsDir, item);

    // Verificar si el item es una carpeta
    if (fs.lstatSync(itemPath).isDirectory()) {
      const gltfDir = path.join(itemPath, 'glTF');

      // Verificar si la subcarpeta glTF existe
      if (fs.existsSync(gltfDir) && fs.lstatSync(gltfDir).isDirectory()) {
        // Leer el contenido de la subcarpeta glTF
        const gltfFiles = fs.readdirSync(gltfDir);

        // Buscar un archivo GLTF/GLB
        const gltfFile = gltfFiles.find(file => ['.gltf', '.glb'].includes(path.extname(file).toLowerCase()));

        if (gltfFile) {
          const fileExtension = path.extname(gltfFile).toLowerCase();
          if (fileExtension === '.gltf') {
            const gltfContent = JSON.parse(fs.readFileSync(path.join(gltfDir, gltfFile), 'utf8'));
            if (gltfContent.asset && parseFloat(gltfContent.asset.version) >= 2.0) {
              models.push({ name: item, path: `/models/car/${item}/glTF/${gltfFile}` });
              gltfCount++;
              gltfNames.push({ name: item, path: `/models/car/${item}/glTF/${gltfFile}` });
              console.log(`Model ${item} has a GLTF file with version ${gltfContent.asset.version}.`);
            } else {
              console.log(`Model ${item} has an unsupported GLTF version ${gltfContent.asset.version}.`);
            }
          } else if (fileExtension === '.glb') {
            models.push({ name: item, path: `/models/car/${item}/glTF/${gltfFile}` });
            glbCount++;
            glbNames.push({ name: item, path: `/models/car/${item}/glTF/${gltfFile}` });
            console.log(`Model ${item} has a GLB file.`);
          }
        } else {
          console.log(`Model ${item} does not have a GLTF/GLB file.`);
        }
      } else {
        console.log(`Model ${item} does not have a glTF folder.`);
      }
    }
  });

  console.log(`Total GLTF models found: ${gltfCount}`);
  console.log(`Total GLB models found: ${glbCount}`);

  return { models, gltfCount, glbCount, gltfNames, glbNames };
}

module.exports = getGLTFFiles;
