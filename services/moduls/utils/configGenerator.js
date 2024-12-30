// utils/configGenerator.js
import { v4 as uuidv4 } from 'uuid';
import { generateRandomPassword, gigabytesToBytes } from './utils.js';

/**
 * Generate a new client configuration.
 * @param {Array} inbounds - Inbounds configuration array.c
 * @returns {Object} Client configuration object.
 */
function generateConfig(username, vol, inData) {
    console.log('generate config says : ' + username)
    const inboundWeWant = process.env.SELECTED_INBOUNDS
        ? JSON.parse(process.env.SELECTED_INBOUNDS)
        : [];

    const volume = vol < 1000 ? gigabytesToBytes(vol) : vol

    const uniquePassword = generateRandomPassword();
    const clientName = username;
    const uuid = uuidv4();

    return {
        key: "clients",
        action: "new",
        obj: {
            enable: true,
            name: clientName,
            config: {
                mixed: { username: clientName, password: uniquePassword },
                socks: { username: clientName, password: uniquePassword },
                http: { username: clientName, password: uniquePassword },
                shadowsocks: { name: clientName, password: uuidv4() },
                shadowsocks16: { name: clientName, password: uuidv4() },
                shadowtls: { name: clientName, password: uuidv4() },
                vmess: { name: clientName, uuid: uuid, alterId: 0 },
                vless: { name: clientName, uuid: uuid, flow: "xtls-rprx-vision" },
                trojan: { name: clientName, password: uniquePassword },
                naive: { username: clientName, password: uniquePassword },
                hysteria: { name: clientName, auth_str: uniquePassword },
                tuic: { name: clientName, uuid: uuid, password: uniquePassword },
                hysteria2: { name: clientName, password: uniquePassword }
            },
            inbounds: inboundWeWant.map(inb => inb),
            links: inboundWeWant.map(inb => {
                const inBoundData = inData.find(inDt => inDt.tag == inb)

                const configDatas = {
                    server: inBoundData.addrs[0].server || '',
                    serverPort: inBoundData.addrs[0].server_port || '',
                    type: inBoundData.outJson?.transport?.type || 'tcp',
                    host: inBoundData.outJson?.transport?.headers?.Host ? `&host=${inBoundData.outJson?.transport?.headers?.Host}` : '',
                    path: inBoundData.outJson?.transport?.path ? `&path=${inBoundData.outJson.transport.path}` : '',
                }
                const { server, serverPort, type, host, path } = configDatas

                return {
                    type: "local",
                    remark: inb,
                    uri: `vless://${uuid}@${server}:${serverPort}?type=${type}${host + path}#${inb}`
                }
            }),
            volume: volume,
            expiry: 0,
            up: 0,
            down: 0,
            desc: "",
            group: ""
        }
    };
}

async function generateEditConfig(config) {
    return {
        "key": "clients",
        "action": "edit",
        "obj": { ...config, enable: true }
    }
}

async function selectWantedInbounds(inbounds, username) {
    const inboundWeWant = process.env.SELECTED_INBOUNDS

    const selectedInbounds = await inbounds.map((inb, index) => ({ data: inb, index })).filter(inb => inboundWeWant.includes(inb.data.tag));
    return await selectedInbounds.filter(inb => !inb.data.users.includes(username))
}

/**
 * Generate inbounds configuration.
 * @param {Array} inbounds - Inbounds configuration array.
 * @returns {Array} Array of inbounds configuration objects.
 */
async function generateInbound(inbounds, client) {
    const selectedInbounds = await selectWantedInbounds(inbounds, client.name)
    if (!selectedInbounds) return []

    await selectedInbounds.forEach(inb => {
        inb.data.users.push({
            name: client.name,
            uuid: client.config.vless.uuid
        });
    })
    return selectedInbounds.map((inb) => ({
        key: "inbounds",
        action: "edit",
        index: inb.index,
        obj: inb.data
    }));
}

async function generateExperimental(experimental, newUsername) {
    experimental.v2ray_api.stats.users.push(newUsername)
    return {
        "key": "experimental",
        "action": "set",
        "obj": experimental
    }

}


export { generateConfig, generateEditConfig, generateInbound, generateExperimental };
