import { checkLoginStatus, loginToServer } from "../../../services/api/auth.js";

describe("Integration test for ensureLoggedIn function", ()=>{
    it("Should check the user is logged in or not", async ()=>{
        const loggedIn = await checkLoginStatus(process.env.SERVER_URL);
        expect(typeof loggedIn).toBe("boolean")
    })

    it("Should login seccusfully if user is not loged in", async ()=>{
        const loginSuccess = await loginToServer(process.env.SERVER_URL, process.env.USER_CREDENTIALS);
        expect(loginSuccess).toBeTruthy()
    })

    it("Should make sure user is logged in after login test", async ()=>{
        const loggedIn = await checkLoginStatus(process.env.SERVER_URL);
        expect(loggedIn).toBeTruthy()
    })
})