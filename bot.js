const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const config = require('./config.json');

const bot = mineflayer.createBot({
  host: config.serverHost,
  port: config.serverPort,
  username: config.botUsername,
  version: "1.20.1"
});

bot.loadPlugin(pathfinder);

bot.on('messagestr', (message) => {
  const msg = message.toLowerCase();
  console.log('[CHAT]: ' + message);

  if (msg.includes('/login')) {
    setTimeout(() => bot.chat('/login shafin1819'), 2000);
  }

  const captchaMatch = message.match(/\b[a-zA-Z0-9]{3}\b/);
  if (captchaMatch && (msg.includes('captcha') || msg.includes('verify') || msg.includes('code'))) {
    setTimeout(() => {
      bot.chat(captchaMatch[0]); // [0] যোগ করা হয়েছে সঠিক কোডটি পাঠাতে
    }, 3000);
  }

  if (msg.includes('success') || msg.includes('welcome') || msg.includes('lobby')) {
    setTimeout(() => findAndClickNPC(), 7000);
  }
});

bot.on('windowOpen', (window) => {
  setTimeout(() => {
    bot.clickWindow(3, 0, 0);
    setTimeout(() => {
      bot.clickWindow(4, 0, 0);
    }, 2000);
  }, 3000);
});

function findAndClickNPC() {
  try {
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    const survivalNPC = bot.nearestEntity((entity) => {
      return entity.type === 'player' && 
             entity.metadata && 
             JSON.stringify(entity.metadata).toLowerCase().includes('survival');
    });

    if (survivalNPC) {
      const goal = new goals.GoalFollow(survivalNPC, 2);
      bot.pathfinder.setGoal(goal);
      bot.once('goal_reached', () => {
        bot.lookAt(survivalNPC.position.offset(0, 1.6, 0));
        bot.activateEntity(survivalNPC);
        setTimeout(() => bot.chat('/home s'), 10000);
      });
    } else {
      bot.chat('/server survival');
      setTimeout(() => bot.chat('/home s'), 10000);
    }
  } catch (e) { console.log(e) }
}

setInterval(() => {
  if (bot.entity) {
    const yaw = Math.random() * Math.PI * 2;
    bot.look(yaw, 0, false);
  }
}, 25000);

bot.on('error', (err) => console.log('Error: ' + err));
bot.on('end', () => setTimeout(() => process.exit(), 5000));
