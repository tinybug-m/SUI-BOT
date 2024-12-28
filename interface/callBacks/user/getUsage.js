import getConfigUsage from "../../../services/moduls/clients/getUsage/getConfigUsage.js";
import loadingCallBack from "../loading.js";



const getUsage = async (ctx, username) => {
    loadingCallBack(ctx);
    const wantedUsername = ctx?.match[1] || username;
    const usageData = await getConfigUsage(wantedUsername);

    if (!usageData) {
        return ctx.reply('⚠️ Could not retrieve usage data.');
    }

    const { used, volume } = usageData;
    const percentage = (used / volume) * 100;
    // const progressBar = '🟥'.repeat(Math.round(percentage / 10)) + '🟩'.repeat(10 - Math.round(percentage / 10));
    const progressBar2 = '🔳'.repeat(Math.round(percentage / 10)) + '⬜️'.repeat(10 - Math.round(percentage / 10));
    // const progressBar3 = '⬛️'.repeat(Math.round(percentage / 10)) + '🟦'.repeat(10 - Math.round(percentage / 10));
    const message = [
        `<b>🧑‍💻 استفاده برای: </b><i>${wantedUsername}</i>`,
        `<b>📊 ${(volume - used).toFixed(2)} گیگابایت باقی‌مانده</b>`,
        `<b>${progressBar2} ${Math.round(percentage)}% </b>`,
        `<b>📈 ${used} / ${volume} GB</b>`,  // Changed the icon here
        '<i>🔗 جزئیات بیشتر به زودی...</i>'
    ].join('\n\n');



    try {
        await ctx.editMessageText(message, { parse_mode: 'HTML' });
    } catch (error) {
        console.error('Error sending message:', error);
        ctx.reply('⚠️ An error occurred while sending the message.');
    }
};

export default getUsage;