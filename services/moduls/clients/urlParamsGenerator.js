export const urlParamsGenerator = ({ clientData = [], configData = [], tls = [], inData = [] }) => {
    // Generates URL-encoded data using provided data
    console.log({clientData})
    const finalData = new URLSearchParams({
        config: JSON.stringify(configData),
        clients: JSON.stringify([clientData]),
        tls: JSON.stringify(tls),
        inData: JSON.stringify(inData),
    }).toString();

    return finalData;
};