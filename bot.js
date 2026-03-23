const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const API = "https://website-kiemtien.onrender.com";

client.on("ready", ()=>{
  console.log("🤖 Bot online");
});

client.on("messageCreate", async (msg)=>{
  if(msg.author.bot) return;

  if(msg.content.startsWith("!code")){
    let code = msg.content.split(" ")[1];

    let res = await axios.post(API + "/check-code", {
      code,
      discordId: msg.author.id
    });

    if(res.data.status === "invalid") return msg.reply("❌ Code sai");
    if(res.data.status === "used") return msg.reply("❌ Code đã dùng");
    if(res.data.status === "expired") return msg.reply("⏱️ Code hết hạn");

    if(res.data.status === "ok"){
      msg.reply("✅ Thành công! Tổng point: " + res.data.points);
    }
  }

  // 🏆 leaderboard
  if(msg.content === "!top"){
    let res = await axios.get(API + "/leaderboard");

    let text = "🏆 TOP USER:\n";
    res.data.forEach((u,i)=>{
      text += `${i+1}. ${u.discordId} - ${u.points} point\n`;
    });

    msg.reply(text);
  }

});

client.login("TOKEN_BOT");
