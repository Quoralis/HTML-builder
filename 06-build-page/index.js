const fs = require('fs').promises;
const path = require('path');

const dirStylesFiles = path.join(__dirname, 'styles');
const dirAssetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const dirBundle = path.join(__dirname, 'project-dist', 'style.css');
const dirProject = path.join(__dirname, 'project-dist');
const dirCopyAssets = path.join(__dirname, 'project-dist', 'assets');
const pathTemplate = path.join(__dirname, 'template.html');
const pathIndexHTML = path.join(__dirname, 'project-dist', 'index.html');

async function bundleStyles() {
  try {
    await fs.mkdir(dirProject, { recursive: true });
    await fs.rm(dirBundle, { force: true });

    const styleFile = (await fs.readdir(dirStylesFiles)).filter(
      (file) => path.extname(file) === '.css',
    );

    for (const file of styleFile) {
      const pathFile = path.join(dirStylesFiles, file);
      const stat = await fs.stat(pathFile);
      if (stat.isFile()) {
        const data = await fs.readFile(pathFile, 'utf-8');
        await fs.appendFile(dirBundle, data);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function copyAssets(dirSrc, dirDest) {
  const filesSrcDir = await fs.readdir(dirSrc, { withFileTypes: true });
  for (const file of filesSrcDir) {
    const pathFile = path.join(dirSrc, file.name);
    const pathDestFile = path.join(dirDest, file.name);

    if (file.isDirectory()) {
      await fs.mkdir(pathDestFile, { recursive: true });
      console.log(`Done: ${file.name}`);
      await copyAssets(pathFile, pathDestFile);
    } else {
      console.log(`Done: ${file.name}`);
      await fs.copyFile(pathFile, pathDestFile);
    }
  }
}

async function updateHTML() {
  let textHTML = await fs.readFile(pathTemplate, 'utf-8');
  const filesComponents = await fs.readdir(componentsPath, {
    withFileTypes: true,
  });

  for (const file of filesComponents) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentContent = await fs.readFile(
        path.join(componentsPath, file.name),
        'utf-8',
      );

      textHTML = textHTML.replace(
        `{{${path.parse(file.name).name}}}`,
        componentContent,
      );
    }
  }

  await fs.writeFile(pathIndexHTML, textHTML);
  console.log('update index done!');
}

async function buildPage() {
  try {
    await bundleStyles();
    await copyAssets(dirAssetsPath, dirCopyAssets);
    await updateHTML();
  } catch (err) {
    console.log(err);
  }
}

buildPage();
