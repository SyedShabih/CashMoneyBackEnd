import { Bot, InlineKeyboard } from "grammy";
// import { createToken } from "./jwt.js";
// import { registerUser } from "./operations";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

export const bot = new Bot(token);

const keyboard = new InlineKeyboard().game("Start Cash Money");

bot.command("start", async (ctx) => {
  await ctx.replyWithGame("cashmny", { reply_markup: keyboard });
});

/*
// Commands - Start, Play, Leaderboard, About, Help
bot.command("start", async (ctx) => {
    const userDocId = await registerUser(ctx.from?.id.toString() || "", ctx.from?.first_name || "", ctx.from?.last_name || "", ctx.from?.username || "") as string;
    console.log("User doc id:", userDocId);
    ctx.replyWithPhoto("https://img.etimg.com/thumb/msid-106967420,width-300,height-225,imgsize-478624,resizemode-75/my-life-with-the-walter-boys-season-2-see-everything-we-know-about-renewal-production-plot-and-more.jpg", {
        "caption": `<b>Hi, ${ctx.from?.first_name}</b><br><p>Play the game now and become top players in the leaderboard!!!</p>`,
        "parse_mode": "HTML"
    })
});
bot.command("play", async (ctx) => {
    const userDocId = await registerUser(ctx.from?.id.toString() || "", ctx.from?.first_name || "", ctx.from?.last_name || "", ctx.from?.username || "") as string;
    console.log("User doc id:", userDocId);
    const keyboard = new InlineKeyboard().game("Play now!")
        .row()
        .text("Leaderboard", "leaderboard")
        .text("About", "about");
    ctx.replyWithGame("qbot_game", {
        reply_markup: keyboard,
        protect_content: true,
        disable_notification: true
    });
});
bot.command("leaderboard", (ctx) => {
    ctx.reply("Leaderboard!!! \n1. User1\n2. User2\n3. User3");
});
bot.command("about", (ctx) => {
    ctx.reply("About!!! \nThis is a game bot");
});
bot.command("help", (ctx) => {
    ctx.reply(`
    <b>Settle Mints Game Bot Help</b><br>
    <p>Get in touch with the game support team.</p>
  `, { parse_mode: "HTML" })
});
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data === "leaderboard") {
        ctx.reply("Leaderboard!!! \n1. User1\n2. User2\n3. User3");
    } else if (data === "about") {
        ctx.reply("About!!! \nThis is a game bot");
    }
});
*/

bot.on("callback_query:game_short_name", async (ctx) => {
//   const token = createToken(ctx.from.id.toString());
//   console.log("Token: " + token);
//   const url = `https://settle-mints-game.netlify.app/?token=${token}`;
  const url = process.env.GAME_URL;
  await ctx.answerCallbackQuery({
    url
  });
});

bot.catch((err) => console.error(err));
