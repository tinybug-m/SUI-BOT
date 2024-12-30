import { fetchLoads } from "../../../api/clientApis.js";
import { bytesToGigabytes, findClientByUsername } from "../../utils/utils.js";

const getConfigUsage = async (wantedUserName) => {
    console.log({wantedUserName})
    const loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
    if (!loads) {
        console.warn('Failed to fetch loads. Exiting...');
        return;
    }

    const selectedClient = findClientByUsername(loads.clients, wantedUserName)
    const usage = {
        volume: bytesToGigabytes(selectedClient.volume),
        used: bytesToGigabytes(selectedClient.down + selectedClient.up)
    }

    console.log({usage})
    return usage
}

export default getConfigUsage