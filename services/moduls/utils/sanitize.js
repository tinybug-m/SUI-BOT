import { generateRandomUsername } from "./utils.js";

export function sanitizeName(name) {
    const cleanedName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return cleanedName;
}

export function determineClientName(ctx) {
    const baseName = sanitizeName(ctx.from?.first_name) || sanitizeName(ctx.from?.username) || generateRandomUsername();
    return baseName;
}