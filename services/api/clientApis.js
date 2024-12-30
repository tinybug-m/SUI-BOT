// clientApis.js
import ensureLoggedIn from "./ensureLoggedIn.js";
import { client } from "./clientSession.js";

/**
 * Fetches loads from the server.
 * @param {string} serverUrl - The URL of the server.
 * @param {Object} credentials - The user credentials.
 * @returns {Object|undefined} - Load data or undefined on failure.
 */
async function fetchLoads(serverUrl, credentials) {
    if (!(await ensureLoggedIn(serverUrl, credentials))) return;

    try {
        const response = await client.get(`${serverUrl}/load`);
        return response.data.obj;
    } catch (error) {
        console.error('Error fetching loads:', error.message);
    }
}

/**
 * Saves client API configuration data to the server.
 * @param {Object} configData - Configuration data to save.
 * @param {string} serverUrl - The URL of the server.
 * @param {Object} credentials - The user credentials.
 * @returns {Object|undefined} - Saved data or undefined on failure.
 */
async function saveClientApiConfig(configData, serverUrl, credentials) {
    if (!(await ensureLoggedIn(serverUrl, credentials))) return;

    try {
        const response = await client.post(`${serverUrl}/save`, configData);
        return response.data;
    } catch (error) {
        console.error('Error saving client API configuration:', error.message);
    }
}

export { fetchLoads, saveClientApiConfig };