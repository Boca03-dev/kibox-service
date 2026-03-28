const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const componentRoutes = require('./routes/componentRoutes');
const configurationRoutes = require('./routes/configurationRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/configurations', configurationRoutes);
app.use('/api/games', gameRoutes);

module.exports = app;