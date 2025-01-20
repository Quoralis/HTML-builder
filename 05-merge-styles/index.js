const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'styles');
const dirBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    await fs.rm(dirBundle, { force: true });

    const files = await fs.readdir(dirPath);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    for (const file of cssFiles) {
      const pathFile = path.join(__dirname, 'styles', file);
      const stat = await fs.stat(pathFile);
      if (stat.isFile()) {
        const data = await fs.readFile(pathFile, 'utf-8');

        await fs.appendFile(dirBundle, data);
      }
    }
  } catch (err) {
    console.log('Error' + err);
  }
}
mergeStyles();
