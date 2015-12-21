import path from 'path';
import {
  readFileSync as read,
  writeFileSync as write
} from 'fs';


let memoryCache = null
const cacheFile = path.join(process.cwd(), '.blessedstandupcache');
try {
  memoryCache = JSON.parse(read(cacheFile, 'utf8'));
} catch (e) {
  memoryCache = {};
}

export const get = (key) => {
  return memoryCache[key];
};

export const set = (key, value) => {
  memoryCache[key] = value;

  process.nextTick(() => write(cacheFile, JSON.stringify(memoryCache)));
  return value;
};

