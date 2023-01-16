const { Schema, model } = require('mongoose');
const lodash = require('lodash');

const Roles = require('../config/role.enum')

const userSchema = new Schema({
    userName: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    role: {
        type: String,
        enum: Object.keys(Roles),
        default: Roles.USER,
        required:true
    },
}, {
    timestamps:true,
});



module.exports = model('User', userSchema);

