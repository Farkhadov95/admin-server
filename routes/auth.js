const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const { Reg } = require('../models/reg');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let auth = await Reg.findOne({ email: req.body.email });
    if (!auth) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, auth.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    auth.logTime = new Date();
    await auth.save();

    const token = auth.generateAuthToken();
    res.send(auth);
});

async function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
        password: Joi.string().min(1).required()
    });

    try {
        return await schema.validateAsync(user);
    } catch (error) {
        return { error };
    }
}

module.exports = router;
