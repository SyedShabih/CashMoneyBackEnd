import { Bot, InlineKeyboard } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error("BOT_TOKEN is unset");
export const bot = new Bot(token);
const keyboard = new InlineKeyboard().game("Start Cash Money");
bot.command("start", async (ctx) => {
    await ctx.replyWithGame(process.env.GAME_SHORT_NAME, { reply_markup: keyboard });
});

bot.on("callback_query:game_short_name", async (ctx) => {
    const url = process.env.GAME_URL;
    await ctx.answerCallbackQuery({
        url
    });
});
bot.catch((err) => console.error(err));
