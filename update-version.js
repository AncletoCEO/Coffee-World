const fs = require('fs');
const path = require('path');

// Leer package.json para obtener la versión
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Leer index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Reemplazar la versión en el HTML
const versionRegex = /<span class="version-info">v[\d.]+<\/span>/g;
const newVersionTag = `<span class="version-info">v${version}</span>`;

indexContent = indexContent.replace(versionRegex, newVersionTag);

// Escribir el archivo actualizado
fs.writeFileSync(indexPath, indexContent, 'utf8');

console.log(`✅ Versión actualizada a v${version} en index.html`);