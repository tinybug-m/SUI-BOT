import { fetchLoads } from "../../../services/api/clientApis"
import { findClientByUsername } from "../../../services/moduls/utils/utils"

describe("it should test the moduls of working to get a clinet usage with username directry from API", () => {
    let wantedUserName = "tinyBug_VZp3fxQ0"
    let loads, selectedClient

    beforeAll(async () => {
        loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
        if (!loads) {
            console.warn('Failed to fetch loads. Exiting...');
            return;
        }
    })

    it("should find client from server and if there is not exist return false", async () => {
        selectedClient = findClientByUsername(loads.clients, wantedUserName)
        const usage = {
            volume: selectedClient.volume,
            used: selectedClient.down + selectedClient.up
        }
        console.log({ usage })

        return usage
    })
})