export const gigabytesToBytes = (gigabytes) => gigabytes * 1024 * 1024 * 1024;
export const bytesToGigabytes = (gigabytes) => {
    const gb = gigabytes / 1024 / 1024 / 1024;
    return gb.toFixed(2)
}


export const findClientByUsername = (clients, username) => clients.find(client => client.name == username)
export const addVolumeToClient = (initialVolume, plusVolume) => initialVolume += gigabytesToBytes(plusVolume)



export const generateRandomPassword = () => Math.random().toString(36).slice(-10);
export const generateRandomUsername = () => Array(8).fill().map(() => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 62)]).join('');
