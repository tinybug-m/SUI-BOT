import { addConfigToUser } from "../../database/index.js";
import receiptImage from "./payment/receiptImage.js";
import selectConfig from "./user/selectConfig.js";

export default async function messageHandler(ctx) {
    const message = ctx.message
    if (message.text) {
        const userMessage = message.text;
        const urlPattern = /\/login\/([A-Za-z0-9_-]+)$/;

        // Check if the message matches the URL pattern
        const match = userMessage.match(urlPattern);
        if (match) {
            const extractedValue = match[1];  // The part after /login/
            await addConfigToUser(ctx.from.id, { username: extractedValue, notif: false })
            await ctx.reply(`کانفیگ ${extractedValue} با موفقیت اضافه شد!`);

            await selectConfig(ctx)
            // Process the extracted value here (Username-xVfhWPzB)
        } else {
            await ctx.reply("فرمت لینک وارد شده نامعتبر است.\n\nلطفاً لینک کانفیگ معتبر خود را به فرمت زیر ارسال کنید:\nhttps://client.example.com:2096/login/yourConfig");
        }
    }
    if (message.photo) {
        receiptImage(ctx)
    }
}