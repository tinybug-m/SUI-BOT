// botInstance.js
import { Bot, session } from 'grammy';
import BOT_TOKEN from './config.js';

const bot = new Bot(BOT_TOKEN);

bot.use(session({
    initial: () => ({})
}));

export default bot;