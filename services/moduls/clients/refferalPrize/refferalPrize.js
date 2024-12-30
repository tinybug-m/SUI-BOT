import { setUserFirstPay } from '../../../../database/index.js';
import bot from '../../../../interface/botInstance.js';
import editConfigUsage from '../editConfig/editConfig.js';
import handleRefferalPrize from './handleRefferalPrize.js';

const refferalPrize = async (userId, paymentId) => {
    try {
        const prizeInformation = await handleRefferalPrize(userId, paymentId);
        if (!prizeInformation) return false;

        const { inviterSubscriptionName, inviterCommission, inviterID } = prizeInformation;
        const success = await editConfigUsage(userId, inviterSubscriptionName, inviterCommission);

        if (success) {

            const message = [
                `<b>🎉 تبریک! دوست شما یک خرید انجام داده است.</b>`,
                `🌟 به خاطر دعوت شما، <b>${inviterCommission} گیگ</b> به کانفیگ <b>${inviterSubscriptionName}</b> شما اضافه شد.`
            ].join('\n\n');

            // Pass userId to setUserFirstPay
            await setUserFirstPay(userId);

            // Send the message if firstPay was successfully updated
            return await bot.api.sendMessage(inviterID, message, { parse_mode: 'HTML' });
        }
    } catch (error) {
        console.error('Error in refferalPrize:', error.message);
        return null;
    }
};

export default refferalPrize;
