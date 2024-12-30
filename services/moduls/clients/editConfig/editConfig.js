import { fetchLoads, saveClientApiConfig } from "../../../api/clientApis.js";
import { handleEditConfigDatas } from "./handleEditConfigDatas.js";



async function editConfigUsage(userId, username = "tinyvpn", volume = 10) {

    const loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
    if (!loads) {
        console.warn('Failed to fetch loads. Exiting...');
        return;
    }

    const finalData = await handleEditConfigDatas(loads, username, volume)

    const apiResponse = await saveClientApiConfig(finalData, process.env.SERVER_URL, process.env.USER_CREDENTIALS)
    await updateSubscriptionNotif(userId, username, false)

    return (apiResponse?.success ? true : false)

}

export default editConfigUsage