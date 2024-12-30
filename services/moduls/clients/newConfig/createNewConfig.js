import { addConfigToUser } from "../../../../database/index.js";
import { fetchLoads, saveClientApiConfig } from "../../../api/clientApis.js";
import { generateRandomUsername } from "../../utils/utils.js";
import handleNewConfigDatas from "./handleNewConfigDatas.js";



async function createNewConfig(username = "tinyvpn", volume = 10,userId) {
    console.log('createNewConfig says : ' + username)

    const loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
    if (!loads) {
        console.warn('Failed to fetch loads. Exiting...');
        return;
    }

    username = `${username}_${generateRandomUsername()}`


    const configData = await handleNewConfigDatas(loads, username, volume)

    const apiResponse = await saveClientApiConfig(configData, process.env.SERVER_URL, process.env.USER_CREDENTIALS)

    if(apiResponse.success){
        const configAdded = await addConfigToUser(userId,{ username: username, notif: false })
        console.log({configAdded})
    }

    return username
}

export default createNewConfig