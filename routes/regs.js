const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { validate, Reg, validateStatus } = require('../models/reg');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await Reg.findById(req.user._id).select('-password');
    res.send(user);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let reg = await Reg.findOne({ email: req.body.email });
    if (reg) return res.status(400).send('User already registered.');

    reg = new Reg(_.pick(req.body, ['email', 'password']));
    const salt = await bcrypt.genSalt(10);
    reg.password = await bcrypt.hash(reg.password, salt);

    await reg.save();

    const token = reg.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(reg, ['_id', 'email']));
});

router.get('/', auth, async (req, res) => {
    const regs = await Reg.find().sort('name');
    res.send(regs);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateStatus(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Reg.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, {
        new: true
    });

    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
    const user = await Reg.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

module.exports = router;
