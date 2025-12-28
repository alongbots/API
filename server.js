const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// No API key required

// Import API handlers directly
const cards = require('./api/cards.js');
const randomcard = require('./api/randomcard.js');
const cardtier = require('./api/cardtier.js');
const cardid = require('./api/cardid.js');
const chatgpt = require('./api/chatgpt.js');
const cohere = require('./api/cohere.js');
const copilot = require('./api/copilot.js');
const enhance = require('./api/enhance.js');
const facebook = require('./api/facebook.js');
const igdl = require('./api/igdl.js');
const imagen3 = require('./api/imagen3.js');
const musicapple = require('./api/musicapple.js');
const nsfw = require('./api/nsfw.js');
const spotify = require('./api/spotify.js');
const tiktok = require('./api/tiktok.js');
const twitter = require('./api/twitter.js');
const youtube = require('./api/youtube.js');

// Wrap each handler into Express endpoints
app.all('/cards', cards);
app.all('/randomcard', randomcard);
app.all('/cardtier', cardtier);
app.all('/cardid', cardid);
app.all('/chatgpt', chatgpt);
app.all('/cohere', cohere);
app.all('/copilot', copilot);
app.all('/enhance', enhance);
app.all('/facebook', facebook);
app.all('/igdl', igdl);
app.all('/imagen3', imagen3);
app.all('/musicapple', musicapple);
app.all('/nsfw', nsfw);
app.all('/spotify', spotify);
app.all('/tiktok', tiktok);
app.all('/twitter', twitter);
app.all('/youtube', youtube);

// Define events
const events = [
    { route: 'winter-cards', file: 'winter_cards.json' },
    { route: 'summer-cards', file: 'summer_cards.json' },
    { route: 'halloween-cards', file: 'halloween_cards.json' },
    { route: 'chinese-new-year-cards', file: 'chinese_new_year_cards.json' },
    { route: 'valentines-day-cards', file: 'valentines_day_cards.json' },
    { route: 'easter-cards', file: 'easter_cards.json' },
    { route: 'my-hero-academia-ccg-cards', file: 'my_hero_academia_ccg_cards.json' },
    { route: 'maid-day-cards', file: 'maid_day_cards.json' },
    { route: 'gala-cards', file: 'gala_cards.json' },
    { route: 'sworn-cards', file: 'sworn_cards.json' }
];

// Function to create router for an event
const createEventRouter = (fileName) => {
    const router = express.Router();
    const filePath = path.join(__dirname, 'cards', fileName);

    router.all('/cards', async (req, res) => {
        try {
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cards' });
        }
    });

    router.all('/randomcard', async (req, res) => {
        try {
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data.length === 0) return res.status(404).json({ error: 'No cards available' });
            const randomCard = data[Math.floor(Math.random() * data.length)];
            res.json(randomCard);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch random card' });
        }
    });

    router.all('/cardtier', async (req, res) => {
        try {
            let { tier } = req.query;
            if (!tier) return res.status(400).json({ error: 'Please provide a tier, e.g. ?tier=S' });
            tier = tier.toUpperCase();
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const filtered = data.filter(card => card.tier === tier);
            res.json(filtered);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cards by tier' });
        }
    });

    router.all('/cardid', async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Please provide a card ID, e.g. ?id=...' });
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const card = data.find(c => c.id === id);
            if (!card) return res.status(404).json({ error: 'Card not found' });
            res.json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch card by ID' });
        }
    });

    return router;
};

// Add routes for each event
events.forEach(event => {
    app.use(`/${event.route}`, createEventRouter(event.file));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});