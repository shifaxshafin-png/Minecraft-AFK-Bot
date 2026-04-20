const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000);

console.log('Web server is online to keep the bot alive.');

http.createServer((req, res) => res.end('Bot is alive!')).listen(process.env.PORT || 3000);

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const config = require('./config.json');

const bot = mineflayer.createBot({
  host: config.serverHost,
  port: parseInt(config.serverPort),
  username: config.botUsername,
  version: "1.21", 
  auth: 'offline'
});

bot.loadPlugin(pathfinder);

bot.on('messagestr', (message) => {
  const msg = message.toLowerCase();
  console.log('[CHAT]: ' + message);

  if (msg.includes('/login') || msg.includes('register')) {
    setTimeout(() => bot.chat('/login shafin1819'), 3000);
  }

  const captchaMatch = message.match(/\b[a-zA-Z0-9]{3,6}\b/);
  if (captchaMatch && (msg.includes('captcha') || msg.includes('verify'))) {
    setTimeout(() => bot.chat(captchaMatch[0]), 4000);
  }

  if (msg.includes('success') || msg.includes('welcome') || msg.includes('lobby')) {
    setTimeout(() => bot.chat('/server survival'), 7000);
    setTimeout(() => bot.chat('/home s'), 15000);
  }
});

setInterval(() => {
  if (bot.entity) bot.look(Math.random() * Math.PI * 2, 0, false);
}, 25000);

bot.on('error', (err) => console.log('Error: ' + err));
bot.on('end', () => setTimeout(() => process.exit(), 10000));
bot.on('end', () => {
  console.log('Bot connection ended. Restarting...');
  http.createServer
