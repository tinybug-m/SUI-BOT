import { generateEditConfig } from "../../utils/configGenerator.js"
import { addVolumeToClient, findClientByUsername } from "../../utils/utils.js"
import { urlParamsGenerator } from "../urlParamsGenerator.js"

export const handleEditConfigDatas = async (loads, username, plusVolume) => {

    const selectedClient = findClientByUsername(loads.clients, username)
    selectedClient.volume = addVolumeToClient(selectedClient.volume, plusVolume)
    selectedClient.enable = true

    const clientData = await generateEditConfig(selectedClient)

    const finalData = urlParamsGenerator({ clientData })
    return finalData
}