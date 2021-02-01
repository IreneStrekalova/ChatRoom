require('dotenv').config();
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.info(`Connected to MongoDB - ${dbUrl}`);
});
mongoose.connection.on('error', () => {
    console.error('Connection ERROR');
});

module.exports = mongoose;