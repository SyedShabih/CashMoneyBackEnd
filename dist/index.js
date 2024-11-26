import express from "express";
import http from "http";
import cors from "cors";
import { webhookCallback } from "grammy";
import { bot } from "./bot.js";

const domain = String(process.env.DOMAIN);
const secretPath = String(process.env.BOT_TOKEN);
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(`/${secretPath}`, webhookCallback(bot, "express"));

app.get("/", (req, res) => {
    res.send("Welcome to the bot server!");
});

// Start the server
server.listen(Number(process.env.PORT), async () => {
    console.log("Server is up and running!");
    try {
        await bot.api.setWebhook(`${domain}/webhook/${secretPath}`);
        console.log(`Webhook set to ${domain}/webhook/${secretPath}`);
    } catch (err) {
        console.error("Failed to set webhook:", err);
    }
});