const jwt = require('jsonwebtoken');
const config = require('config');
const { Reg } = require('../models/reg');

module.exports = async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    const currentUserEmail = req.header('current-user-email');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    if (currentUserEmail) {
        let currentUser = await Reg.findOne({ email: currentUserEmail });

        if (!currentUser) return res.status(400).send('Access denied');
        if (!currentUser.isActive) return res.status(400).send('Access denied. This account is blocked');
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
};
