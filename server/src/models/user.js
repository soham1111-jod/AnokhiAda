const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; 
        },
        minlength: 6,
    },
    lastName:{
        type: String,
        default: null,
    },
    phoneNo:{
        type:Number,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    googleId: {
        type: String,
        default: null,
    },
} , {timestamps:true});

const User = mongoose.model('User', userSchema);
module.exports = User;