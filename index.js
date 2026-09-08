git add .const { Telegraf } = 
require('telegraf'); git commit -m "Add dummy 
HTTP server for Render port binding"
git push origin main// ⚠️ আপনার bot token এখানে বসান
const BOT_TOKEN = '8832544765:AAFAMjyDZFOvBFGyfh1F_C7WqJMlXK6Irt0';

// Admin এর Telegram user ID
const ADMIN_ID = 5672570073;

// যে চ্যানেলে পোস্ট হবে
const CHANNEL_ID = '@Smart_Earning_BD24';

const bot = new Telegraf(BOT_TOKEN);

// /start command
bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    ctx.reply('👋 Admin Panel — যেকোনো মেসেজ পাঠান, চ্যানেলে পোস্ট হয়ে যাবে।\n\nলিংক দিলে সুন্দর inline button সহ পোস্ট হবে।');
  } else {
    ctx.reply('👋 Welcome to Smart Earning BD24 বট!');
  }
});

// Text message handler — শুধু admin এর মেসেজ প্রসেস হবে
bot.on('text', async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  if (ctx.message.text.startsWith('/')) return; // কমান্ড হলে স্কিপ

  const text = ctx.message.text;
  const urlMatch = text.match(/(https?:\/\/\S+)/);

  try {
    if (urlMatch) {
      const link = urlMatch[1];
      const cleanText = text.replace(link, '').trim();

      await bot.telegram.sendMessage(CHANNEL_ID, cleanText || '🔗', {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: '🔗 Open Link', url: link }]]
        }
      });
    } else {
      await bot.telegram.sendMessage(CHANNEL_ID, text, { parse_mode: 'HTML' });
    }

    ctx.reply('✅ Posted to channel!');
  } catch (err) {
    console.error('Post error:', err);
    ctx.reply('❌ পোস্ট করতে সমস্যা হয়েছে। বট চ্যানেলে admin আছে কিনা চেক করুন।\nError: ' + err.message);
  }
});

bot.launch();

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(PORT, () => {
  console.log(`Dummy server running on port ${PORT} (for Render)`);
});
console.log('Bot is running...');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
