import { Telegraf, Markup } from "telegraf";
import process from "process";
import path from "path";

import dotenv from "dotenv";
dotenv.config();
import express from "express";

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  throw new Error("BOT_TOKEN must be provided!");
}
const port = process.env.PORT || 3000;
const webhookDomain = process.env.WEBHOOK_DOMAIN;

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(await bot.createWebhook({ domain: webhookDomain }));

const gameShortName = process.env.GAME_SHORT_NAME;
const gameUrl = process.env.GAME_URL;

async function handlerStart(ctx) {
  const pathToCoinClick = path.resolve(process.cwd(), "media/notecoin.png");

  await ctx.sendMediaGroup([
    {
      type: "photo",
      media: { source: pathToCoinClick },
      caption: "Click on the coin and get rewards",
    },
  ]);

  await ctx.reply(
    "Launch mini app from inline keyboard!",
    Markup.inlineKeyboard([Markup.button.webApp("🎮 Play now!", gameUrl)])
  );
}

bot.start(handlerStart);
bot.command("game", handlerStart);

bot.launch();

app.listen(port, () => console.log("Listening on port", port));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
