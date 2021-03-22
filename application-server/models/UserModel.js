const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    active: { type: Boolean, required: true },
    activeHash: { type: String, required: true },
    facebookToken: { type: String, required: false },
    oauth: {
        google: {
            googleId: { type: String, required: false },
            refresh_token: { type: String, required: false },
            code: { type: String, required: false }
        },
        github: {
            githubId: { type: String, required: false },
            refresh_token: { type: String, required: false }
        },
        facebook: {
            facebookId: { type: String, required: false },
            refresh_token: { type: String, required: false }
        },
        spotify: {
            spotifyId: { type: String, required: false },
            refresh_token: { type: String, required: false }
        },
    },
    services: [{
        name: { type: String, required: false }
    }],
    composant : [{
        fctId: { type: String, required: false },
        name: { type: String, required: false },
        timer: { type: Number, required: false },
        args: { type: [String], required: false }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);