const fs = require('fs-extra');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.resolve(__dirname, 'public'))) {
  fs.mkdirSync(path.resolve(__dirname, 'public'), { recursive: true });
  console.log('Created public directory');
}

// Create index.html if it doesn't exist
const indexHtmlPath = path.resolve(__dirname, 'public/index.html');
if (!fs.existsSync(indexHtmlPath)) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mermaid Diagram Editor</title>
  <meta name="description" content="Interactive Mermaid diagram editor">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  
  fs.writeFileSync(indexHtmlPath, htmlContent);
  console.log('Created index.html file');
}

// Copy public folder to dist
fs.copySync(
  path.resolve(__dirname, 'public'),
  path.resolve(__dirname, 'dist'),
  {
    filter: (src) => {
      return !src.includes('index.html');
    }
  }
);
console.log('Public folder copied to dist!');