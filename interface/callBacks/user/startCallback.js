import { getUser } from "../../../database/index.js";
import { MainButtons } from "../../components/Buttons/MainButtons.js";

export default async ctx => {
    const userId = ctx.from.id;

    const referralCode = ctx.message.text.split(' ')[1] || 0; // Extract referral code
    console.log('baba')
    console.log({referralCode})

    if (referralCode) {
        await ctx.reply('Welcome! You have been successfully referred.');
    }
    await getUser(userId,Number(referralCode));

    // Send the welcome message with bold text using Markdown
    const message = [
        '<b>🎉 خوش آمدید به ربات ما!</b>',

        'در اینجا می‌توانید از امکانات مختلف ربات استفاده کنید:',

        '<b>🛒 خرید کانفیگ:</b> برای خرید کانفیگ جدید، این گزینه را انتخاب کنید.',
        '<b>💳 شارژ موجودی:</b> برای شارژ حساب خود و بهره‌مندی بیشتر از خدمات، این گزینه را انتخاب کنید.',
        '<b>📋 جزئیات کانفیگ:</b> برای مشاهده جزئیات کانفیگ فعلی خود، این گزینه را انتخاب کنید.',
        '<b>🎁 دعوت از دوستان:</b> با دعوت از دوستان خود، می‌توانید از پاداش‌ها و مزایای ویژه بهره‌مند شوید.',

        'برای شروع، یکی از گزینه‌ها را انتخاب کنید و از امکانات ربات بهره‌مند شوید. در صورت نیاز به کمک، من همیشه در خدمت شما هستم.',

        '<b>بیایید شروع کنیم! 👇</b>',
    ].join('\n\n');

    ctx.reply(message, {
        reply_markup: {
            keyboard: MainButtons,
            resize_keyboard: true,
            one_time_keyboard: true
        },
        parse_mode: 'HTML'
    });

};
