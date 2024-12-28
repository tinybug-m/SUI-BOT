import { fetchLoads, saveClientApiConfig } from "../../../services/api/clientApis";
import { urlParamsGenerator } from "../../../services/moduls/clients/urlParamsGenerator";
import { generateEditConfig, generateInbound } from "../../../services/moduls/utils/configGenerator";
import { addVolumeToClient, findClientByUsername, gigabytesToBytes } from "../../../services/moduls/utils/utils";

describe("this test is going to check editConfig work", () => {
    let wantedUserName = "tinyBug_VZp3fxQ0"
    const plusVolume = 10
    let editInbounds, configData = []
    let loads, selectedClient, clientData, finalData, apiResponse

    beforeAll(async () => {
        loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
        if (!loads) {
            console.warn('Failed to fetch loads. Exiting...');
            return;
        }
    })

    it("should find client from server and if there is not exist return false", async () => {
        selectedClient = findClientByUsername(loads.clients, `${wantedUserName}01`)
        expect(selectedClient).toBeFalsy()

        selectedClient = findClientByUsername(loads.clients, wantedUserName)
        expect(selectedClient).toEqual(expect.objectContaining({ name: wantedUserName }))
    })

    it("should add new extra volume to client", async () => {
        const initialVolume = selectedClient.volume
        const plusVolumeToByte = gigabytesToBytes(plusVolume)

        selectedClient.volume = addVolumeToClient(selectedClient.volume, plusVolume)

        expect(selectedClient.volume).toBe(initialVolume + plusVolumeToByte)
    })

    it("should generate fullEdited currect client json", async () => {
        clientData = await generateEditConfig(selectedClient)
        expect(clientData).toEqual(expect.objectContaining({
            "key": "clients",
            "action": "edit",
            "obj": { ...selectedClient, enable: true }
        }))
    })

    //
    it("it should check user is inside the selected inbounds or not", async () => {
        editInbounds = await generateInbound(loads.config.inbounds, selectedClient)
        expect(Array.isArray(editInbounds)).toBe(true)
        configData = [...editInbounds]
    })

    it("should test the urlParamsGenerator", async () => {
        console.log({ configData })
        finalData = urlParamsGenerator({ clientData, configData })
        expect(typeof finalData).toBe("string")
    })
    it("should test the API is working", async () => {
        apiResponse = await saveClientApiConfig(finalData, process.env.SERVER_URL, process.env.USER_CREDENTIALS)
        expect(apiResponse.success).toBeTruthy()
    })

    it("should undo the test", async () => {
        selectedClient.volume = addVolumeToClient(selectedClient.volume, -plusVolume)
        clientData = await generateEditConfig(selectedClient)
        finalData = urlParamsGenerator({ clientData })
        apiResponse = await saveClientApiConfig(finalData, process.env.SERVER_URL, process.env.USER_CREDENTIALS)

        expect(apiResponse.success).toBeTruthy()
    })
    // // done
})