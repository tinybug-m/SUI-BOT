import { getUserConfigs } from "../../../database/index.js";
import { SelectConfigButtons } from "../../components/Buttons/SelectConfigButtons.js";
import { generateInlineKeyboards } from "../../utils/generateInlineKeyboards.js";

export default async function selectConfig(ctx, action) {
    const userConfigs = await getUserConfigs(ctx.from.id)
    const selectConfigButtonsTest = SelectConfigButtons(userConfigs, action)

    ctx.reply(
        [
            '<b>لطفاً یکی از کانفیگ‌های موجود خود را انتخاب نمایید:</b>',
            'شما می‌توانید از کانفیگ‌های فعلی خود استفاده کنید یا یک کانفیگ جدید اضافه نمایید.',
            'برای انتخاب کانفیگ جدید، کافی است گزینه مربوطه را انتخاب کنید.'
        ].join('\n\n'),
        {
            parse_mode: 'HTML',
            ...generateInlineKeyboards(selectConfigButtonsTest)
        }
    )
}