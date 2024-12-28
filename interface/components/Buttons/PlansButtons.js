export const PlansButtons = [
    [{ text: `✨ ۲۰ گیگابایت - ${20 * process.env.PRICE_PER_GIGABYTE},۰۰۰ تومان`, callback_data: 'sendPaymentCard_20' }],
    [{ text: `🔥 ۴۰ گیگابایت - ${40 * process.env.PRICE_PER_GIGABYTE},۰۰۰ تومان`, callback_data: 'sendPaymentCard_40' }],
    [{ text: `💎 ۱۰۰ گیگابایت - ${100 * process.env.PRICE_PER_GIGABYTE},۰۰۰ تومان`, callback_data: 'sendPaymentCard_100' }]
]
