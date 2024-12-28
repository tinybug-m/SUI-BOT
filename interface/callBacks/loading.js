const loadingCallBack = (ctx) => {
    ctx.editMessageText(
        '<b>⏳ لطفاً منتظر بمانید...</b>',
        {
            parse_mode: 'HTML',
        }
    );
};

export default loadingCallBack;