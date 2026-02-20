const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WEBHOOK_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

app.post('/webhook', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.chat || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text;

  let responseText = '';

  if (text === '/start' || text === '/help') {
    responseText = 'Привет! Я — Цитатник ИИ 🤖\n\nОтправь /quote — получишь цитату.\n/site — мой сайт про ИИ.';
  } 
  else if (text === '/quote') {
    const quotes = [
      'ИИ — это не замена человеку, а зеркало его возможностей.',
      'Галлюцинации ИИ — это когда он слишком уверен в своём воображении.',
      'Ты не учишь ИИ — ты учишься у него быть смелее.',
      'Цитата — это мысль, упакованная в одну строку.',
      'Если ИИ ошибается — это не баг, а приглашение подумать.'
    ];
    responseText = quotes[Math.floor(Math.random() * quotes.length)];
  }
  else if (text === '/site') {
    responseText = '🌐 Официальный сайт:\nhttps://ai-websait.pages.dev\n\nТам — про ИИ, ботов и как начать самому.';
  }
  else {
    responseText = 'Не знаю такой команды. Попробуй /quote или /site';
  }

  try {
    await axios.post(`${WEBHOOK_URL}/sendMessage`, {
      chat_id: chatId,
      text: responseText,
      parse_mode: 'HTML'
    });
  } catch (e) {
    console.error('Ошибка отправки:', e.message);
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot started on port ${PORT}`);
});
