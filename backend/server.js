require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY;

// GET /api/sports — list available sports
app.get('/api/sports', async (req, res) => {
  try {
    const { data } = await axios.get(`${ODDS_API_BASE}/sports`, {
      params: { apiKey: API_KEY },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/odds/:sport — fetch odds for a given sport key
// Query params forwarded: regions, markets, oddsFormat
app.get('/api/odds/:sport', async (req, res) => {
  const { sport } = req.params;
  const { regions = 'eu', markets = 'h2h', oddsFormat = 'decimal' } = req.query;

  try {
    const { data } = await axios.get(`${ODDS_API_BASE}/sports/${sport}/odds`, {
      params: { apiKey: API_KEY, regions, markets, oddsFormat },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
