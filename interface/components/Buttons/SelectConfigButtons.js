export const SelectConfigButtons = (configs = [], action) => {

    const configButtons = configs.map(
        config => [{ text: config, callback_data: `${action}_${config}` }]
    )
    const addAnExsitingConfig = [{ text: 'افزودن کانفیگ موجود', callback_data: 'addAnExistingConfig' }];

    return [...configButtons, addAnExsitingConfig]

}
