import { addPayment } from "../../../database/index.js";
import bot from '../../botInstance.js';
import { generateInlineKeyboards } from "../../utils/generateInlineKeyboards.js";

export default async ctx => {
    // Skip messages from the bot itself
    if (ctx.from.id === bot.botInfo.id) {
        return; // Don't process the bot's own messages
    }

    // Ensure the message is a photo
    if (ctx.message.photo) {
        const userId = ctx.from.id;
        const receipt = ctx.message.photo[ctx.message.photo.length - 1].file_id; // Get the highest quality photo
        const selectedPlan = ctx.session.selectedPlan;

        const selectedConfig = ctx.session.selectedConfig

        // Check if a plan is selected
        if (!selectedPlan) {
            return ctx.reply('لطفا ابتدا یک طرح انتخاب کنید.');  // "Please select a plan first."
        }

        // Add payment to the database
        const paymentID = await addPayment(userId, Number(selectedPlan), String(selectedConfig));

        // Prepare admin notification buttons
        const Buttons = [
            [{ text: 'تایید', callback_data: `accept_${userId}_${paymentID}` }],
            [{ text: 'رد', callback_data: `reject_${userId}_${paymentID}` }]
        ];
        const replyMarkup = generateInlineKeyboards(Buttons);

        try {
            // Send the receipt to the admin
            await bot.api.sendPhoto(
                process.env.ADMIN_ID,  // Admin's Telegram ID
                receipt,
                {
                    caption: `کاربر ${userId} رسید پرداخت برای طرح ${selectedPlan} گیگابایت را ارسال کرده است.`, // Informative caption
                    ...replyMarkup
                }
            );

            // Inform the user their receipt was sent successfully
            ctx.reply('رسید پرداخت شما به مدیر ارسال شد و در حال بررسی است.');
        } catch (error) {
            // Catch any errors while sending the receipt to the admin
            console.error('Error sending receipt to admin:', error);
            ctx.reply('متاسفانه مشکلی در ارسال رسید به مدیر پیش آمد. لطفا دوباره تلاش کنید.');  // "Sorry, there was an error sending your receipt. Please try again."
        }
    } else {
        // If the message is not a photo, notify the user
        ctx.reply('لطفا یک تصویر از رسید پرداخت خود ارسال کنید.');  // "Please send an image of your payment receipt."
    }
};
