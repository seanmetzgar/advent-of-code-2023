import fs from 'fs';
import { Data } from './types';
const files: string[] = fs.readdirSync('./data');
const data: Data = {};

files.forEach((file: string) => {
    if (file.endsWith('.data')) {
        const day: string = file.replace('.data', '');
        data[day] = fs
            .readFileSync('./data/' + file, 'utf-8')
            .replace(/\r\n/g, '\n');
    }
});

export default data;
