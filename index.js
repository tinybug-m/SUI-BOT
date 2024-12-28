import 'dotenv/config';
import bot from './interface/botInstance.js';
import { withErrorHandling } from './interface/utils/errorHandling.js';

// Import callback handlers
import * as callbacks from './interface/callBacks/index.js';
import { generateInlineKeyboards } from './interface/utils/generateInlineKeyboards.js';
import { BackToMainMenuButton } from './interface/components/Buttons/BackToMainMenuButton.js';

// --- Command Handlers ---
bot.command('start', withErrorHandling(callbacks.startCallback));
bot.callbackQuery('start', withErrorHandling(callbacks.startCallback));


bot.hears('💼 خرید کانفیگ', withErrorHandling(callbacks.plansList));

bot.callbackQuery(/sendPaymentCard_(.+)/, withErrorHandling(callbacks.sendPaymentCard));

bot.hears('🔋 شارژ کانفیگ', ctx => withErrorHandling(callbacks.selectConfig(ctx, 'selectConfig')));
bot.callbackQuery(/selectConfig_(.+)/, withErrorHandling(callbacks.plansList));
bot.callbackQuery('addAnExistingConfig', withErrorHandling(callbacks.addAnExsistingConfig));
// bot.on('message', withErrorHandling(callbacks.receiptImage)); // gets the config url and add it to database

bot.hears('📋 جزئیات کانفیگ', ctx => withErrorHandling(callbacks.selectConfig(ctx, 'getUsage')));
bot.callbackQuery(/getUsage_(.+)/, withErrorHandling(callbacks.getUsage));

const chiDoroyMigoy = async (ctx) => {
    const referralMessage = [
        "🎉 لینک دعوت شما آماده است:",
        `🔗 https://t.me/Testtinybug_bot?start=${ctx.from.id}`,
        "",
        "📢 اگر دوست شما اولین کانفیگ خود را خریداری کند، شما 10٪ از مبلغ خرید او را به عنوان جایزه دریافت خواهید کرد!",
    ].join("\n");

    await ctx.reply(referralMessage, { parse_mode: "HTML" });
}

bot.hears('👥 دعوت از دوستان', withErrorHandling(chiDoroyMigoy));

const chiDoroyMigoy2 = async (ctx) => {
    const message = [
        'برای ارتباط با پشتیبانی، از طریق لینک زیر با ما در تماس باشید:',
        '<a href="https://t.me/tinybug_dev"><b>@tinybug_dev</b></a>',
    ].join('\n\n');
    await ctx.reply(message, { parse_mode: 'HTML' });
}

bot.hears('🆘 پشتیبانی', withErrorHandling(chiDoroyMigoy2));

bot.command('health', (ctx) => ctx.reply('Bot is running!!'));


bot.on('message', withErrorHandling(callbacks.messageHandler));

bot.callbackQuery(/(accept|reject)_(\d+)_(.+)/, withErrorHandling(callbacks.receiptApproval));

// Add global error handling
bot.catch(async (err) => {
    console.error('Error caught by Grammy:', err);
    // You can log this error to an external service like Sentry
    // or send a notification to you (developer) about the issue
    await bot.api.sendMessage(
        process.env.ADMIN_ID,
        `An error occurred: ${err.message}`
    );
});

// Start the bot
bot.start();
