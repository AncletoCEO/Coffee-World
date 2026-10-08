const fs = require('fs');
const path = require('path');

// Leer package.json para obtener la versión
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Sincronizar la versión en la app Angular (UI canónica)
const angularPackagePath = path.join(__dirname, 'angular-app', 'package.json');
const angularPackage = JSON.parse(fs.readFileSync(angularPackagePath, 'utf8'));
angularPackage.version = version;
fs.writeFileSync(angularPackagePath, JSON.stringify(angularPackage, null, 2) + '\n', 'utf8');

console.log(`✅ Versión actualizada a v${version} en angular-app/package.json`);
