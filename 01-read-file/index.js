const path = require('path');
const fs = require('fs');
const {stdout} = require('process')

const textReadStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

textReadStream.on('data', chunk => stdout.write(chunk));
