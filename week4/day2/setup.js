const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = ['public/images', 'data'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy images
if (fs.existsSync('images')) {
  const files = fs.readdirSync('images');
  for (const file of files) {
    fs.copyFileSync(path.join('images', file), path.join('public/images', file));
  }
  console.log('Images copied successfully.');
}

// Copy data.json
if (fs.existsSync('data.json')) {
  fs.copyFileSync('data.json', path.join('data', 'data.json'));
  console.log('Data.json copied successfully.');
}
