// plansListCallback.js
import { PlansButtons } from "../../components/Buttons/PlansButtons.js";
import { generateInlineKeyboards } from "../../utils/generateInlineKeyboards.js";

const data = {
    title: [
        '<b>برای خرید کانفیگ، لطفاً یکی از گزینه‌های زیر را انتخاب فرمایید:</b>',
        'هر گزینه شامل حجم مشخصی از داده‌ها است که قیمت آن به‌طور خودکار محاسبه خواهد شد.',
        '<b>با انتخاب یکی از این گزینه‌ها، به مرحله پرداخت هدایت خواهید شد.</b>'
    ].join('\n\n'),
    args: { ...generateInlineKeyboards(PlansButtons), parse_mode: 'html' }
}




const plansList = (ctx) => {
    const selectedConfig = ctx?.match[1]; // Either "accept" or "reject"

    // im just checking user is going to buy usage or buy config
    ctx.session.selectedConfig = selectedConfig == '\udcbc' ? 0 : selectedConfig;

    ctx.reply(data.title, data.args)
}

export { plansList }
