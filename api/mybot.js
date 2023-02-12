import { Telegraf } from "telegraf";
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on("text", async (ctx) => {
  try {
    // Explicit usage
    // await ctx.telegram.sendMessage("888032960", `Hello ${ctx.state.role}`);
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
    console.log(ctx);

    // Using context shortcut
    // ctx.reply(`Hello ${ctx.state.role}`);
  } catch (error) {
    console.log("Error en bot",error)
  }
});

// bot.launch();
export default bot;
