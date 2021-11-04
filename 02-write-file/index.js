const path = require('path');
const fs = require('fs');
const {stdin, stdout} = require('process');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Enter text:\n');

stdin.on('data', data => dataHandler(data));
process.on('SIGINT', exitApp);

function dataHandler (data) {
    const str = data.toString();
    if (str.slice(0, str.length - 2) === 'exit') exitApp();
    output.write(data);
}

function exitApp () {
    stdout.write('\nGood bye ... \n\n');
    process.exit();
}