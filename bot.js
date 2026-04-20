const mineflayer = require('mineflayer');
const config = require('./config.json');

const bot = mineflayer.createBot({
  host: config.serverHost,
  port: config.serverPort,
  username: config.botUsername,
  version: "1.20.1"
});

bot.on('messagestr', (message) => {
  console.log('[CHAT]: ' + message);

  if (message.includes('/login')) {
    setTimeout(() => {
      bot.chat('/login Shafin1819');
    }, 2000);
  }

  const captchaMatch = message.match(/\b[a-zA-Z0-9]{3}\b/);
  if (captchaMatch && (message.toLowerCase().includes('captcha') || message.toLowerCase().includes('code'))) {
    setTimeout(() => {
      bot.chat(captchaMatch[0]);
    }, 3500);
  }

  if (message.includes('success') || message.includes('logged in')) {
    setTimeout(() => {
      bot.chat('/lobby'); 
    }, 5000);
  }
});

bot.on('windowOpen', (window) => {
  console.log('GUI Captcha Opened.');
  setTimeout(() => {
    bot.clickWindow(3, 0, 0);
    setTimeout(() => {
      bot.clickWindow(4, 0, 0);
    }, 2000);
  }, 3000);
});

bot.on('spawn', () => {
  setTimeout(() => {
    bot.chat('/home s');
  }, 15000);

  setInterval(() => {
    const entity = bot.nearestEntity();
    if (entity && entity.type === 'player') {
      bot.lookAt(entity.position.offset(0, 1.6, 0));
    }
  }, 10000);
});

setInterval(() => {
  const yaw = Math.random() * Math.PI * 2;
  bot.look(yaw, 0, false);
}, 30000);

bot.on('error', (err) => console.log('Error: ' + err));
bot.on('kicked', (reason) => console.log('Kicked: ' + reason));
bot.on('end', () => {
  setTimeout(() => process.exit(), 10000);
});

