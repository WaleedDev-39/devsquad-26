const fs = require('fs');
const path = require('path');

const projectRoot = "e:\\my coding stuff\\devsquad'26\\week4\\day19_hackathon";
const srcDir = path.join(projectRoot, "frontend", "src");

// 1. Copy data.js
const srcData = path.join(projectRoot, "data.js");
const destData = path.join(srcDir, "data.js");
try {
  fs.copyFileSync(srcData, destData);
  console.log("Copied data.js to frontend/src/data.js");
} catch(e) {
  console.error("Failed to copy data.js", e);
}

// 2. recursive find replace
function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fileP = path.join(dir, file);
    const stat = fs.statSync(fileP);
    if (stat && stat.isDirectory()) {
      walk(fileP);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fileP, 'utf8');
      
      // Calculate relative path from this file to frontend/src/data.js
      let relPath = path.relative(path.dirname(fileP), destData);
      relPath = relPath.replace(/\\/g, '/');
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath;
      }
      // Remove trailing .js for brevity if we want, or keep it.
      relPath = relPath.replace(/\.js$/, '');

      let changed = false;
      const regex = /from\s+['"]([^'"]*data(?:\.js)?)['"]/g;
      const newContent = content.replace(regex, (match, p1) => {
        // If it's importing something with 'data', check if it has lots of '../' implying root data
        if (p1.includes('../') && !p1.includes('src/data')) {
           console.log(`Updating import in ${fileP}`);
           changed = true;
           return `from "${relPath}"`;
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fileP, newContent, 'utf8');
      }
    }
  }
}

walk(srcDir);
console.log("Done fixing imports!");
