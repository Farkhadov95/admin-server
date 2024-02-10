const config = require('config');
const mongoose = require('mongoose');
const regs = require('./routes/regs');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || config.get('db'))
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

require('./startup/prod')(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/regs', regs);
app.use('/api/auth', auth)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
