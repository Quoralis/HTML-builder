const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(copyDirPath, { recursive: true });
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const copyFiles = await fs.readdir(copyDirPath);

    for (const copyFile of copyFiles) {
      const copyFilePath = path.join(copyDirPath, copyFile);

      if (!files.find((file) => file.name === copyFile)) {
        await fs.rm(copyFilePath);
      }
    }

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      const copyFilePath = path.join(copyDirPath, file.name);

      if (file.isFile()) {
        await fs.copyFile(filePath, copyFilePath);
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

copyDir();
