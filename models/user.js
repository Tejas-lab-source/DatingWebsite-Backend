const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    profile: {
        type: String,
        required: true
    },
    year: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Other'],
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    interests: {
        type: [String],
        enum: ["Music", "Movies", "Reading", "Hiking", "Cooking", "Gaming", "Photography", "Dancing", "Travelling", "Sports", "Art", "Fitness", "Technology", "Fashion", "Food", "Nature", "Pets", "Writing", "Yoga", "Swimming"],
        default: []
    },
    bio: {
        type: [String],
        required: false
    },

    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    seenProfiles: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rightSwipe: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
