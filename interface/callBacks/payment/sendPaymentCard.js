import { BackToMainMenuButton } from "../../components/Buttons/BackToMainMenuButton.js";
import { generateInlineKeyboards } from "../../utils/generateInlineKeyboards.js";

export default async ctx => {
    ctx.answerCallbackQuery();
    const selectedPlan = await ctx.match[1];

    ctx.session.selectedPlan = selectedPlan;

    const price = `${parseInt(selectedPlan) * process.env.PRICE_PER_GIGABYTE},000 تومان`;

    ctx.editMessageText(
        [
            `<b>شما طرح ${selectedPlan} گیگابایت را انتخاب کرده‌اید.</b>`,
            `هزینه کل این طرح ${price} تومان می‌باشد.`,
            'لطفاً پس از انجام پرداخت، یک تصویر واضح از رسید پرداخت خود را به این ربات ارسال نمایید.',
            'پس از دریافت رسید، تیم مدیریت ما آن را بررسی و تایید خواهد کرد.',
            'از انتخاب سرویس ما سپاسگزاریم.'
        ].join('\n\n'),
        {
            parse_mode: 'HTML',
            ...generateInlineKeyboards(BackToMainMenuButton)
        }
    );

};
