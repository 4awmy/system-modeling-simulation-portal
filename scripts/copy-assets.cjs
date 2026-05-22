const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyDirRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const rootDir = path.resolve(__dirname, '..');
const lecturesSrc = path.join(rootDir, '..', 'Lectures');
const sectionSrc = path.join(rootDir, '..', 'Section');
const lecturesDest = path.join(rootDir, 'dist', 'Lectures');
const sectionDest = path.join(rootDir, 'dist', 'Section');

console.log('Copying Lectures from:', lecturesSrc, 'to:', lecturesDest);
if (fs.existsSync(lecturesSrc)) {
  copyDirRecursive(lecturesSrc, lecturesDest);
  console.log('Lectures copied successfully!');
} else {
  console.warn('Lectures directory not found.');
}

console.log('Copying Section from:', sectionSrc, 'to:', sectionDest);
if (fs.existsSync(sectionSrc)) {
  copyDirRecursive(sectionSrc, sectionDest);
  console.log('Section copied successfully!');
} else {
  console.warn('Section directory not found.');
}
