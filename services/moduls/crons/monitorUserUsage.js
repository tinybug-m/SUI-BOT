import { readDb, updateSubscriptionNotif } from "../../../database/index.js";
import bot from "../../../interface/botInstance.js";
import { fetchLoads } from "../../api/clientApis.js";
import { bytesToGigabytes, gigabytesToBytes } from "../utils/utils.js";

const monitorUserUsage = async () => {
    try {
        const telegramUsers = await readDb();
        const loads = await fetchLoads(process.env.SERVER_URL, process.env.USER_CREDENTIALS);

        if (!loads) {
            console.warn('Failed to fetch loads. Exiting...');
            return;
        }

        // Create a dictionary for quick lookup of VPN configs
        const vpnConfigMap = loads.clients.reduce((map, config) => {
            map[config.name] = config;
            return map;
        }, {});


        for (const user of telegramUsers) {
            for (const subscription of user.subscriptions) {
                if (subscription.notif) {
                    console.log(`Notification already sent for ${subscription.username}`);
                    continue;
                }

                const vpnConfig = vpnConfigMap[subscription.username];
                if (!vpnConfig) {
                    console.log(`No VPN config found for subscription ${subscription.username}.`);
                    continue;
                }

                const usageLeft = vpnConfig.volume - (vpnConfig.down + vpnConfig.up);
                if (usageLeft < gigabytesToBytes(1000)) {
                    console.log(`User ${user.id} with subscription ${subscription.username} has less than 1GB left. Remaining: ${bytesToGigabytes(usageLeft)} GB.`);

                    const message = [
                        `<b>⚠️ هشدار: حجم شما رو به اتمام است!</b>`,
                        `📊 تنها <b>۱ گیگابایت</b> از حجم کانفیگ <b>${subscription.username}</b> باقی مانده است.`,
                        `⏳ لطفاً جهت جلوگیری از قطع سرویس، در اسرع وقت نسبت به تمدید اقدام نمایید.`
                    ].join('\n\n');

                    try {
                        await bot.api.sendMessage(user.id, message, { parse_mode: 'HTML' });
                        await updateSubscriptionNotif(user.id, subscription.username, true);
                        console.log(`Notification sent and updated for ${subscription.username}.`);
                    } catch (error) {
                        console.error(`Failed to send/update notification for ${subscription.username}:`, error);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in usersUsage:', error);
    }
};

export default monitorUserUsage;
