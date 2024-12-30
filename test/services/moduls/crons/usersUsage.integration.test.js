// it should test the functions which they going to check the telegram users usage 

import monitorUserUsage from "../../../../services/moduls/crons/monitorUserUsage"

describe("Should check the process of testing users usages",()=>{
    it("shoud check",async ()=>{
        await monitorUserUsage()
        expect(true).toBe(true)
    })
})