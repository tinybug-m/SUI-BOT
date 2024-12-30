import { checkLoginStatus, loginToServer } from "./auth.js";

async function ensureLoggedIn(serverUrl, credentials) {

    const loggedIn = await checkLoginStatus(serverUrl);
    if (loggedIn) return true;

    const loginSuccess = await loginToServer(serverUrl, credentials);
    if (!loginSuccess) {
        console.error('Failed to log in with provided credentials.');
        return false;
    }

    return true;
}

export default ensureLoggedIn