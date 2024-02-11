const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const regSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    logTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    regTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

regSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

const Reg = mongoose.model('Regs', regSchema);

async function validateReg(reg) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(5).max(1024).required(),
    });

    try {
        return await schema.validateAsync(reg);
    } catch (error) {
        return { error };
    }
}

async function validateUserStatus(reg) {
    const schema = Joi.object({
        isActive: Joi.boolean().required()
    });

    try {
        return await schema.validateAsync(reg);
    } catch (error) {
        return { error };
    }
}

exports.Reg = Reg;
exports.validate = validateReg;
exports.validateStatus = validateUserStatus;
