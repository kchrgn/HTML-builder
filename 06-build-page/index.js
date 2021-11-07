const path = require('path')
const {rm, mkdir, readFile, writeFile, readdir, copyFile} = require('fs/promises');

async function main() {   
    const DIST_FOLDER = path.join(__dirname, 'project-dist');
    
    const SRC_COMP_DIST = path.join(__dirname, 'components');

    const SRC_STYLES_DIR = path.join(__dirname, 'styles');
    const DIST_STYLES_DIR = path.join(DIST_FOLDER, 'style.css');
    
    const SRC_ASSETS_DIR = path.join(__dirname, 'assets');
    const DIST_ASSETS_DIR = path.join(DIST_FOLDER, 'assets');

    await initDistFolder(DIST_FOLDER);
    await createHTML(SRC_COMP_DIST, DIST_FOLDER);
    await createCssBundle (SRC_STYLES_DIR, DIST_STYLES_DIR);
    await copyDir(SRC_ASSETS_DIR, DIST_ASSETS_DIR);
}

async function initDistFolder(target) {

    try {
        await rm(target, {recursive: true, force: true})
    } catch (err) {
        if (err.code != 'ENOENT') throw new Error(err)
    }

    try {
        await mkdir(target);
    } catch (err) {
        throw new Error (err);
    } 
}

async function createHTML(source, target) {
    const templateFile = path.join(__dirname, 'template.html');
    const targetHtmlFile = path.join(target, 'index.html');
    
    const componentDirFiles = await readdir (source, {withFileTypes: true});
    let templateContent = await readFile(templateFile, 'utf-8');

    for (let item of componentDirFiles) {
        if (item.isFile() && path.parse(item.name).ext === '.html') {
            const tagContent = await readFile(path.join(__dirname, 'components', item.name), 'utf-8');
            templateContent = templateContent.replace(`{{${path.parse(item.name).name}}}`, tagContent)
        }
    }
    
    await writeFile (targetHtmlFile, templateContent)
}

async function createCssBundle (source, target) {
    let styles = '';    
    try {
        const dirItems = await readdir(source, {withFileTypes: true});
        for (let item of dirItems) {
            if (item.isFile() && path.parse(item.name).ext === '.css') {
                styles += await readFile(path.join(source, item.name), 'utf-8')
            }
        }
        await writeFile(target, styles) ;
    } catch (err) {
        console.log(err)
    }
}

async function copyDir (source, target) {
    try {
        const dirContent = await readdir (source, {withFileTypes: true});
        await mkdir(target);
        for (let item of dirContent) {
            if (item.isFile()) {
                await copyFile(path.join(source, item.name), path.join(target, item.name))
            }
            if (item.isDirectory()) {
                await copyDir(path.join(source, item.name), path.join(target, item.name))
            }
        }
    } catch (err) {
        console.log(err);
    } 
}

main();