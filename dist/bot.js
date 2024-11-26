import { Bot, InlineKeyboard } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error("BOT_TOKEN is unset");
}
export const bot = new Bot(token);

const keyboard = new InlineKeyboard().game("Start Cash Money");

bot.command("start", async (ctx) => {
    console.log("Received /start command from:", ctx.from.username);
    try {
        await ctx.replyWithGame(process.env.GAME_SHORT_NAME, { reply_markup: keyboard });
        console.log("Sent game button to user");
    } catch (err) {
        console.error("Error sending game button:", err);
    }
});

bot.on("callback_query:game_short_name", async (ctx) => {
    console.log("Received game callback query from:", ctx.from.username);
    const url = process.env.GAME_URL;
    try {
        await ctx.answerCallbackQuery({
            url
        });
        console.log("Answered callback query with game URL");
    } catch (err) {
        console.error("Error answering callback query:", err);
    }
});

bot.catch((err) => {
    console.error("Bot error:", err);
});

console.log("Bot initialized with token:", token);