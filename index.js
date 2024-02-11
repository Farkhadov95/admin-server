const cors = require('cors');
const config = require('config');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const regs = require('./routes/regs');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5555;

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}
const db = config.get('db');
mongoose.connect(db)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

require('./startup/prod')(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/regs', regs);
app.use('/api/auth', auth);


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
