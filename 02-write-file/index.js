const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');

stdout.write('Enter text ');

stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input === 'exit') {
    stdout.write('By');
    exit();
  }

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error('Error', err);
    }
  });
  stdout.write('Enter text: ');
});
