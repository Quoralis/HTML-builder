const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        const fileNameWithoutExtension = file.name.slice(
          0,
          file.name.lastIndexOf('.'),
        );
        console.log(
          `${fileNameWithoutExtension} - ${path
            .extname(file.name)
            .slice(1)} - ${(stats.size / 1024).toFixed(2)} KB`,
        );
      });
    }
  });
});
