import { getPayment, getUser } from "../../../database/index.js"
import bot from "../../../interface/botInstance.js"
import editConfigUsage from "../../../services/moduls/clients/editConfig/editConfig.js"
import handleRefferalPrize from "../../../services/moduls/clients/refferalPrize/handleRefferalPrize.js"

describe("handle refferal prizes function ", () => {
    const userId = 343281698,
        paymentId = 0

    // let purchaser, inviterID, purchaseVolume, inviterCommission, inviterSubscription
    let prizeInformation, purchaser, inviterID, purchaseVolume

    beforeAll(async () => {
        prizeInformation = await handleRefferalPrize(userId, paymentId)
        purchaser = await getUser(userId)

        inviterID = purchaser.inviterID
        purchaseVolume = purchaser.payments.find(p => p.id == paymentId)?.plan
    })

    it("should return right json", () => {
        console.log(prizeInformation)
        const inviterCommission = purchaseVolume / process.env.PRIZE_PERCENT


        expect(prizeInformation).toEqual(expect.objectContaining({
            inviterSubscriptionName: expect.any(String),
            inviterCommission: inviterCommission,
            inviterID: inviterID
        }))
    })

    // it("should check user has purchased before", async () => {
    //     expect(purchaser.firstPay).toBe(false)
    // })
    // it('should check user has a refferal or not', async () => {
    //     expect(typeof inviterID).toBe('number')
    // })

    // it("should check the purchase exist", async () => {
    //     expect(purchaseVolume).toBeTruthy()
    // })
    // it("should calculate the 10% of it to GB", () => {
    //     inviterCommission = purchaseVolume / prizePercent
    //     expect(inviterCommission).toBe(purchaseVolume / prizePercent)
    // })

    // it("should get the fisrt suscription of inviter", async () => {
    //     const inviter = await getUser(inviterID)
    //     inviterSubscription = inviter.subscriptions
    //     expect(Array.isArray(inviterSubscription)).toBe(true)
    // })

    // it("should add the prize to inviter subscription", async () => {
    //     if (inviterSubscription.length) {
    //         try {
    //             console.log(`baraye config ${inviterSubscription[0]} enqad ${inviterCommission} commision darim `)
    //             const addPrizeToInviter = await editConfigUsage(inviterSubscription[0], inviterCommission)
    //             expect(addPrizeToInviter).toBe(true)
    //             const message = [
    //                 `<b>🎉 تبریک! دوست شما یک خرید انجام داده است.</b>`,
    //                 `🌟 به خاطر دعوت شما، <b>2 گیگ</b> به کانفیگ <b>${inviterSubscription[0]}</b> شما اضافه شد.`
    //             ].join('\n\n');
    //             await bot.api.sendMessage(inviterID, message, { parse_mode: 'HTML' });
    //         } catch (error) {
    //             throw new Error('there is a problem when want to add prize to inviter', error)
    //         }
    //     }
    // })

})

// describe("handle refferal prizes", () => {
//     const userId = 343281698,
//         paymentId = 0,
//         prizePercent = 10

//     let purchaser, inviterID, purchaseVolume, inviterCommission, inviterSubscription

//     beforeAll(async () => {
//         purchaser = await getUser(userId)
//         console.log({ purchaser })
//         inviterID = purchaser.inviterID
//         purchaseVolume = purchaser.payments.find(p => p.id == paymentId)?.plan
//     })

//     it("should check user has purchased before", async () => {
//         expect(purchaser.firstPay).toBe(false)
//     })
//     it('should check user has a refferal or not', async () => {
//         expect(typeof inviterID).toBe('number')
//     })

//     it("should check the purchase exist", async () => {
//         expect(purchaseVolume).toBeTruthy()
//     })
//     it("should calculate the 10% of it to GB", () => {
//         inviterCommission = purchaseVolume / prizePercent
//         expect(inviterCommission).toBe(purchaseVolume / prizePercent)
//     })

//     it("should get the fisrt suscription of inviter", async () => {
//         const inviter = await getUser(inviterID)
//         inviterSubscription = inviter.subscriptions
//         expect(Array.isArray(inviterSubscription)).toBe(true)
//     })

//     it("should add the prize to inviter subscription", async () => {
//         if (inviterSubscription.length) {
//             try {
//                 console.log(`baraye config ${inviterSubscription[0]} enqad ${inviterCommission} commision darim `)
//                 const addPrizeToInviter = await editConfigUsage(inviterSubscription[0], inviterCommission)
//                 expect(addPrizeToInviter).toBe(true)
//                 const message = [
//                     `<b>🎉 تبریک! دوست شما یک خرید انجام داده است.</b>`,
//                     `🌟 به خاطر دعوت شما، <b>2 گیگ</b> به کانفیگ <b>${inviterSubscription[0]}</b> شما اضافه شد.`
//                 ].join('\n\n');
//                 await bot.api.sendMessage(inviterID, message, { parse_mode: 'HTML' });
//             } catch (error) {
//                 throw new Error('there is a problem when want to add prize to inviter', error)
//             }
//         }
//     })

// })