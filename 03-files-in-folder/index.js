const path = require('path');
const {readdir} = require('fs/promises');
const {stdout} = require('process');
const {stat} = require('fs');

try {
    const dirPath = path.join(__dirname, 'secret-folder')
    showDirContent(dirPath);
} catch (err) {
    console.log(err)
}

async function showDirContent (dirPath) {
    const dirContent = await readdir (dirPath, {withFileTypes: true});
    for (let item of dirContent) {
        if (item.isFile()) {
            const fileItem = path.parse(item.name);
            stat(path.join(dirPath, item.name), (err, stats) => {
                stdout.write(`${fileItem.name} - ${fileItem.ext.slice(1)} - ${stats.size} bytes\n`)
            });    
        }
    }
}