
const mongoose = require('mongoose');
const Mongoose = require('mongoose')
const { Schema } = mongoose;
const dotenv = require('dotenv');

dotenv.config();
const mongoURL = process.env.db;

mongoose.connect(mongoURL)



const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 30
    },

    lastName: {
        type: String,
        required: true,
        maxLength: 30
    },
    username: {
        required: true,
        type: String,
        lowerCase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
})

const AccountSchema = Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", UserSchema)
const Account = mongoose.model('Account', AccountSchema)

module.exports = { User, Account };