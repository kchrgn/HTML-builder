const fs = require ('fs');
const {rm, mkdir, readdir, copyFile} = require('fs/promises');
const path = require('path');

async function main() {
    const TARGET_DIR_NAME = path.join(__dirname, 'files-copy');
    const SRC_DIR_NAME = path.join(__dirname, 'files');

    await deleteTargetDir(TARGET_DIR_NAME);
    await createTargetDir(TARGET_DIR_NAME);
    await copyDirContent(SRC_DIR_NAME, TARGET_DIR_NAME);
}

async function deleteTargetDir (target) {
    try {
        await rm(target, {recursive: true})
    } catch (err) {
        if (err.code != 'ENOENT') throw new Error(err)
    }
}

async function createTargetDir (target) {
    try {
        await mkdir(target);
    } catch (err) {
        throw new Error (err);
    } 
}

async function copyDirContent(source, target) {
    const dirContent = await readdir (source, {withFileTypes: true})
    for (let item of dirContent) {
        if (item.isFile()) {
            try {
                await copyFile(path.join(source, item.name), path.join(target, item.name) )
            } catch (err) {
                throw new Error (err);
            } 
        }
    }
}

main();
