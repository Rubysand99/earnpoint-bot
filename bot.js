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

const CODE_CHANNEL_ID = "ID_KENH_CODE";
const LOG_CHANNEL_ID = "ID_KENH_LOG";

client.on("ready", ()=>{
  console.log("🤖 Bot online");
});

client.on("messageCreate", async (msg)=>{
  if(msg.author.bot) return;

  if(msg.channel.id !== CODE_CHANNEL_ID) return;

  let code = msg.content.trim();

  if(!code.startsWith("EP-")){
    return msg.reply("code không hợp lệ ❌");
  }

  try{

    let res = await axios.post(API + "/check-code", {
      code: code,
      discordId: msg.author.id
    });

    let log = msg.guild.channels.cache.get(LOG_CHANNEL_ID);

    if(res.data.status === "invalid" || res.data.status === "used"){
      msg.reply("code không hợp lệ ❌");
      if(log) log.send(`❌ ${msg.author.tag}: ${code}`);
      return;
    }

    if(res.data.status === "expired"){
      msg.reply("⏱️ code hết hạn");
      if(log) log.send(`⏱️ ${msg.author.tag}: ${code}`);
      return;
    }

    if(res.data.status === "ok"){
      msg.reply(`code hợp lệ ✔️ +1 point\n💰 Tổng: ${res.data.points}`);
      if(log) log.send(`✅ ${msg.author.tag}: ${code} (+1 point)`);
    }

  }catch(err){
    msg.reply("❌ lỗi server");
  }

});

client.login(process.env.TOKEN);
