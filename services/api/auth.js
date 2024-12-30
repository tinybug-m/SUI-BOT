// auth.js
import { client } from "./clientSession.js";


async function loginToServer(serverUrl, credentials) {
    try {
        console.log(`${serverUrl}/login`)
        console.log({credentials})
        const res = await client.post(`${serverUrl}/login`, credentials);
        if(res.data.success == false) return false
        return true;
    } catch (error) {
        console.error('Login failed:', error.message);
        return false;
    }
}


async function checkLoginStatus(serverUrl) {
    try {
        const response = await client.get(`${serverUrl}/check-session`);
        return true;
    } catch(error) {
        return false;
    }
}

export { checkLoginStatus, loginToServer };
