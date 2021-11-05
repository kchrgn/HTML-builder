const fs = require ('fs');
const {readdir, readFile, writeFile} = require ('fs/promises');
const path = require ('path');

async function main () {
    const STYLES_DIR = path.join(__dirname, 'styles');
    const BOUNDLE_FILE = path.join(__dirname, 'project-dist', 'bundle.css') ;

    try {
        const dirItems = await getDirItems (STYLES_DIR);
        const styles = await combineStyles(dirItems, STYLES_DIR);
        await writeBoundle (styles, BOUNDLE_FILE);
    } catch (err) {
        console.log(err)
    }
}

async function getDirItems (source) {
    try {
        return await readdir(source, {withFileTypes: true})
    } catch {
        throw new Error ('Error: can`t read directory items')
    }
}

async function combineStyles (items, items_dir) {
    try {
        let styles = '';
        for (let item of items) {
            if (item.isFile() && path.parse(item.name).ext === '.css') {
                styles += await readFile(path.join(items_dir, item.name), 'utf-8')
            }
        }
        return styles
    } catch (err) {
        throw new Error ('Error: cant`t read files')
    }
}

async function writeBoundle (content, target) {
    try {
        await writeFile(target, content)
    } catch (err) {
        throw new Error ('Error: can`t write bundle')
    }
}

main();