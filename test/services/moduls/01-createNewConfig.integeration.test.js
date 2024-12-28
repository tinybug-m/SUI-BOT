import { fetchLoads, saveClientApiConfig } from "../../../services/api/clientApis";
import { urlParamsGenerator } from "../../../services/moduls/clients/urlParamsGenerator";
import { generateConfig, generateExperimental, generateInbound } from "../../../services/moduls/utils/configGenerator";

describe("Integration test for createNewConfig function", () => {

    let username = "tinyBug-integrationTest",
        volume = 10

    let loads, clientData, inbounds, experimental, editInbounds, editExperimental, configData, finalData;

    beforeAll(async () => {
        loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS)
        if (!loads) {
            console.warn('Failed to fetch loads. Exiting...');
            return;
        }
    })
    it('should generateConfig funstion returns right JSON', async () => {
        const inboundWeWant = process.env.SELECTED_INBOUNDS
            ? JSON.parse(process.env.SELECTED_INBOUNDS)
            : [];

        clientData = await generateConfig(username, volume, loads.inData);

        console.log({ links: clientData.obj.links })
        expect(clientData).toEqual(expect.objectContaining({
            key: 'clients',
            action: 'new',
            obj: {
                enable: true,
                name: expect.any(String),
                config: expect.any(Object),
                inbounds: expect.arrayContaining([...inboundWeWant]),
                links: expect.any(Array),
                volume: expect.any(Number),
                expiry: expect.any(Number),
                up: expect.any(Number),
                down: expect.any(Number),
                desc: expect.any(String),
                group: expect.any(String)
            }
        }))
    })

    it('should generateInbound funstion returns right style of JSON', async () => {

        inbounds = loads.config.inbounds;

        editInbounds = await generateInbound(inbounds, clientData.obj)

        expect(editInbounds).toEqual(expect.arrayContaining([
            expect.objectContaining({
                key: "inbounds",
                action: "edit",
                index: expect.any(Number),
                obj: expect.any(Object)
            })
        ]))
    })

    it("should generateInbound have selected inbounds inside it", () => {
        const inboundWeWant = process.env.SELECTED_INBOUNDS
            ? JSON.parse(process.env.SELECTED_INBOUNDS)
            : [];

        editInbounds.map(inb => {
            expect(inboundWeWant).toContain(inb.obj.tag)
        })
    })

    it("should editExperimental return  style of JSON", async () => {
        experimental = loads.config.experimental;

        editExperimental = await generateExperimental(experimental, clientData.obj.name)
        expect(editExperimental).toEqual(expect.objectContaining({
            key: "experimental",
            action: "set",
            obj: expect.any(Object)
        }))
    })

    it("should editExperimental return newClient inside of it", () => {
        const useresInsideExperimental = editExperimental.obj.v2ray_api.stats.users
        expect(useresInsideExperimental).toContain(username)
    })

    it("should test the urlParamsGenerator", async () => {
        configData = [...editInbounds, editExperimental]

        finalData = urlParamsGenerator({
            configData,
            clientData
        })
        expect(typeof finalData).toBe("string")
    })

    it("should add newUser to server", async () => {
        const apiResponse = await saveClientApiConfig(finalData, process.env.SERVER_URL, process.env.USER_CREDENTIALS)
        expect(apiResponse.success).toBeTruthy()
    })

    it("should add newConfig to telegram robot database", async () => {
        const configAded = await addConfigToUser(ctx.from.id,extractedValue)
        console.log(configAded)
        expect(true).toBeTruthy()
    })

})