import { generateConfig, generateExperimental, generateInbound } from "../../utils/configGenerator.js";
import { urlParamsGenerator } from "../urlParamsGenerator.js";

export default async (loads, username, volume) => {
    console.log('handle config says : ' + username)
    const { experimental, inbounds } = loads.config;

    // nice
    const clientData = await generateConfig(username, volume, loads.inData);

    const editInbounds = await generateInbound(inbounds, clientData.obj)

    const editExperimental = await generateExperimental(experimental, clientData.obj.name)
    const configData = [...editInbounds, editExperimental]


    const finalData = urlParamsGenerator({
        configData,
        clientData
    })

    return finalData
}