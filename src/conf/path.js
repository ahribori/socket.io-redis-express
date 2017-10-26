require('dotenv').config();
import path from 'path';
import fs from 'fs';

const ROOT_PATH = path.resolve(__dirname, '../../');
let LOG_PATH = process.env.LOG_PATH ? path.resolve(process.env.LOG_PATH) : ROOT_PATH;

try {
    if (!fs.existsSync(LOG_PATH)) {
        fs.mkdirSync(LOG_PATH);
    }
} catch (e) {
    LOG_PATH = ROOT_PATH;
    if (!fs.existsSync(LOG_PATH)) {
        fs.mkdirSync(LOG_PATH);
    }
    console.log(`process.env.LOG_PATH is invalid. Set LOG_PATH to ${LOG_PATH}`);
}

export default {
    LOG_PATH,
}