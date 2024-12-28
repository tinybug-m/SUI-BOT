import bot from "../botInstance.js";
import { BackToMainMenuButton } from "../components/Buttons/BackToMainMenuButton.js";
import { generateInlineKeyboards } from "./generateInlineKeyboards.js";

export async function notifyUser(userId, message) {
    await bot.api.sendMessage(userId, message);
}

export async function updateMessageCaption(ctx, statusText, emoji) {
    const originalCaption = ctx.callbackQuery.message.caption || 'Receipt for approval';
    const reply_markup = generateInlineKeyboards(BackToMainMenuButton)
    await ctx.api.editMessageCaption(
        ctx.callbackQuery.message.chat.id,
        ctx.callbackQuery.message.message_id,
        {
            caption: `${emoji} ${statusText}\n\n${originalCaption}`,
            ...reply_markup
        }
    );
}