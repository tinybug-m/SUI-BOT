import bot from '../../botInstance.js';
import { getPayment, updatePaymentStatus } from "../../../database/index.js";
import { determineClientName } from '../../../services/moduls/utils/sanitize.js';
import { notifyUser, updateMessageCaption } from '../../utils/userNotification.js';
import createNewConfig from '../../../services/moduls/clients/newConfig/createNewConfig.js';
import editConfigUsage from '../../../services/moduls/clients/editConfig/editConfig.js';
import refferalPrize from '../../../services/moduls/clients/refferalPrize/refferalPrize.js';

export default async function receiptApproval(ctx) {
    const action = ctx.match[1]; // Either "accept" or "reject"
    const userId = parseInt(ctx.match[2]); // User's Telegram ID
    const paymentID = parseInt(ctx.match[3]); // Payment ID

    let statusText = '';
    let emoji = '';

    try {
        if (action === 'accept') {


            // Get the client's name and payment volume
            let clientName = determineClientName(ctx),
                message = []

            const { plan, config } = await getPayment(userId, paymentID)                // just Idea
            console.log('before')
            // handle the refferal
            await refferalPrize(userId, paymentID)
            console.log('after')

            // Create a new user after payment acceptance
            // why empty config is == "0"
            if (config && config !== "0") {
                await editConfigUsage(config, plan);
                message = [
                    '<b>🎉 حساب شما با موفقیت شارژ شد!</b>',
                ].join('\n\n');
            } else {
                const apiResponse = await createNewConfig(clientName, plan, userId);
                message = [
                    '<b>🎉 حساب شما با موفقیت ایجاد شد!</b>',

                    'برای استفاده از VPN، لینک زیر را کپی کرده و در اپلیکیشن مورد نظر وارد کنید:',

                    `<code>${process.env.SUBSCRIPTION_URL}${apiResponse}</code>`,
                ].join('\n\n');
            }
            // Update payment status to "accepted"
            await updatePaymentStatus(userId, paymentID, 'accepted');

            await bot.api.sendMessage(userId, message, {
                parse_mode: 'HTML',
            });


            statusText = 'تایید شد ✅';
            emoji = '✅';


        } else if (action === 'reject') {
            // Update payment status to "rejected"
            await updatePaymentStatus(userId, paymentID, 'rejected');

            statusText = 'رد شد ❌';
            emoji = '❌';

            // Notify the user about the rejection
            await notifyUser(userId, '❌ رسید پرداخت شما توسط مدیر رد شد. لطفاً با پشتیبانی تماس بگیرید تا مشکل شما بررسی شود.');
        }

        // Update the message caption with the status (Accepted or Rejected)
        await updateMessageCaption(ctx, statusText, emoji);

    } catch (error) {
        console.error(`Error processing receipt approval for payment ID ${paymentID}:`, error);
        throw new Error(`Error processing receipt approval for payment ID ${paymentID}:`, error)
    }
}
