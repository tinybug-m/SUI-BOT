
export const generateInlineKeyboards = (buttons) => (
    {
        reply_markup: {
            inline_keyboard: buttons
        }
    }
)