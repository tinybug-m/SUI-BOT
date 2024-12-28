import { client } from "../../../services/api/clientSession";
import ensureLoggedIn from "../../../services/api/ensureLoggedIn";

describe("Integration test for fetchLoads function",()=>{
    it('Should login to server', async () => {
        const login = await ensureLoggedIn(process.env.SERVER_URL,process.env.USER_CREDENTIALS)
        expect(login).toBeTruthy()
    });

    it('should fetchLoads return object with config and clients', async () => {
        const response = await client.get(`${process.env.SERVER_URL}/load`)
        expect(response.data.obj).toEqual(expect.objectContaining({
            clients: expect.any(Array),
            config: expect.any(Object)
        }))

        expect(true).toBe(true)
    });
})