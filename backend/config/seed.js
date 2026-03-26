const mongoose = require('mongoose');
require('dotenv').config();
const Game = require('../models/Game');

const games = [
  {
    name: 'GTA V',
    minRequirements: { ramGB: 4, gpuPerformance: 30, cpuPerformance: 35 },
    recommendedRequirements: { ramGB: 8, gpuPerformance: 55, cpuPerformance: 65 }
  },
  {
    name: 'GTA VI',
    minRequirements: { ramGB: 12, gpuPerformance: 60, cpuPerformance: 70 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 75, cpuPerformance: 80 }
  },
  {
    name: 'Cyberpunk 2077',
    minRequirements: { ramGB: 12, gpuPerformance: 58, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 80 }
  },
  {
    name: 'Red Dead Redemption 2',
    minRequirements: { ramGB: 8, gpuPerformance: 45, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 12, gpuPerformance: 58, cpuPerformance: 68 }
  },
  {
    name: 'Elden Ring',
    minRequirements: { ramGB: 12, gpuPerformance: 52, cpuPerformance: 62 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 75, cpuPerformance: 75 }
  },
  {
    name: 'The Witcher 3',
    minRequirements: { ramGB: 8, gpuPerformance: 48, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 70 }
  },
  {
    name: 'God of War',
    minRequirements: { ramGB: 8, gpuPerformance: 47, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 68 }
  },
  {
    name: 'Hogwarts Legacy',
    minRequirements: { ramGB: 16, gpuPerformance: 47, cpuPerformance: 65 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 78, cpuPerformance: 75 }
  },
  {
    name: 'Starfield',
    minRequirements: { ramGB: 16, gpuPerformance: 65, cpuPerformance: 70 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 78, cpuPerformance: 85 }
  },
  {
    name: "Baldur's Gate 3",
    minRequirements: { ramGB: 8, gpuPerformance: 48, cpuPerformance: 60 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 75 }
  },
  {
    name: 'Alan Wake 2',
    minRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 88, cpuPerformance: 82 }
  },
  {
    name: 'The Last of Us',
    minRequirements: { ramGB: 16, gpuPerformance: 48, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 76, cpuPerformance: 75 }
  },
  {
    name: 'Resident Evil 4',
    minRequirements: { ramGB: 8, gpuPerformance: 50, cpuPerformance: 62 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 72 }
  },
  {
    name: 'Spider-Man Remastered',
    minRequirements: { ramGB: 8, gpuPerformance: 45, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 73, cpuPerformance: 62 }
  },
  {
    name: "Assassin's Creed Mirage",
    minRequirements: { ramGB: 8, gpuPerformance: 58, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 82, cpuPerformance: 75 }
  },
  {
    name: 'Fortnite',
    minRequirements: { ramGB: 8, gpuPerformance: 25, cpuPerformance: 40 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 47, cpuPerformance: 62 }
  },
  {
    name: 'Valorant',
    minRequirements: { ramGB: 4, gpuPerformance: 50, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 8, gpuPerformance: 75, cpuPerformance: 68 }
  },
  {
    name: 'CS2',
    minRequirements: { ramGB: 2, gpuPerformance: 20, cpuPerformance: 30 },
    recommendedRequirements: { ramGB: 8, gpuPerformance: 73, cpuPerformance: 68 }
  },
  {
    name: 'League of Legends',
    minRequirements: { ramGB: 2, gpuPerformance: 20, cpuPerformance: 25 },
    recommendedRequirements: { ramGB: 4, gpuPerformance: 35, cpuPerformance: 45 }
  },
  {
    name: 'Minecraft',
    minRequirements: { ramGB: 4, gpuPerformance: 15, cpuPerformance: 20 },
    recommendedRequirements: { ramGB: 8, gpuPerformance: 50, cpuPerformance: 60 }
  },
  {
    name: 'FIFA 25',
    minRequirements: { ramGB: 8, gpuPerformance: 35, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 12, gpuPerformance: 73, cpuPerformance: 68 }
  },
  {
    name: 'Call of Duty',
    minRequirements: { ramGB: 8, gpuPerformance: 52, cpuPerformance: 65 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 82, cpuPerformance: 75 }
  },
  {
    name: 'Apex Legends',
    minRequirements: { ramGB: 8, gpuPerformance: 48, cpuPerformance: 60 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 76, cpuPerformance: 60 }
  },
  {
    name: 'Rust',
    minRequirements: { ramGB: 10, gpuPerformance: 40, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 75, cpuPerformance: 68 }
  },
  {
    name: 'ARK: Survival Ascended',
    minRequirements: { ramGB: 8, gpuPerformance: 48, cpuPerformance: 58 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 82, cpuPerformance: 75 }
  },
  {
    name: 'Battlefield 2042',
    minRequirements: { ramGB: 8, gpuPerformance: 75, cpuPerformance: 70 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 90, cpuPerformance: 85 }
  },
  {
    name: 'Diablo IV',
    minRequirements: { ramGB: 8, gpuPerformance: 35, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 82, cpuPerformance: 75 }
  },
  {
    name: 'Path of Exile 2',
    minRequirements: { ramGB: 8, gpuPerformance: 58, cpuPerformance: 68 },
    recommendedRequirements: { ramGB: 16, gpuPerformance: 82, cpuPerformance: 78 }
  },
  {
    name: 'Palworld',
    minRequirements: { ramGB: 16, gpuPerformance: 52, cpuPerformance: 55 },
    recommendedRequirements: { ramGB: 32, gpuPerformance: 88, cpuPerformance: 75 }
  },
  {
    name: 'Detroit: Become Human',
    minRequirements: { ramGB: 8, gpuPerformance: 43, cpuPerformance: 48 },
    recommendedRequirements: { ramGB: 12, gpuPerformance: 65, cpuPerformance: 58 }
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await Game.deleteMany({});
    await Game.insertMany(games);
    console.log(`${games.length} igrica uspešno dodato u bazu!`);
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });