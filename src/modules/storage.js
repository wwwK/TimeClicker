import { enums } from "./enums";
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.storage);

// Public API
const api = {};

api.hasItem = (key) => {
    return localStorage.hasOwnProperty(key);
}

api.setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

api.removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    }
    catch {}
}

api.getItem = (key) => {
    let rawJson = localStorage.getItem(key);
    if(!rawJson || (rawJson?.length ?? 0) === 0) { rawJson = '{}'; }

    try {
        return JSON.parse(rawJson);
    }
    catch(err) {
        logger.error('getItem', err);
        api.removeItem(key);
        return undefined;
    }
}

export default api;