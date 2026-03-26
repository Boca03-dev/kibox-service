const Game = require('../models/Game');

exports.getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};