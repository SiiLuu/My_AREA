const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel.js');
const auth = require('../controllers/AuthController.js');
const {
    registerValidation,
    loginValidation
} = require('../src/validation.js');
const MailConfirmation = require('../controllers/MailController.js');
const GithubController = require('../controllers/GithubController.js');
const FacebookController = require('../controllers/FacebookController.js');

router.get('/infos', auth, async (req, res) => {
    const user = await User.findOne({
        _id: req.user._id
    });
    if (!user) return res.status(420).send();

    const username = user.username;
    const email = user.email;
    return res.status(200).send({
        username: username,
        email: email
    });
});

router.post('/register', async (req, res) => {
    const {
        error
    } = registerValidation(req.body);
    if (error) return res.status(415).send(error.details[0].message);
    const emailExist = await User.findOne({
        email: req.body.email
    });
    if (emailExist) return res.status(416).send('Email already exist !');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const hashActive = await bcrypt.hash(req.body.username, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        active: false,
        activeHash: hashActive.replace(/[^0-9a-z]/gi, ''),
        subscribe: []
    });
    MailConfirmation.MailController(req.body.email, hashActive.replace(/[^0-9a-z]/gi, ''));
    try {
        await user.save();
        res.status(200).send("Success !");
    } catch (err) {
        res.status(415).send(err);
    }
});

router.post('/login', async (req, res) => {
    const {
        error
    } = loginValidation(req.body);
    if (error) return res.status(418).send(error.details[0].message);

    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(418).send('Invalid email !');

    if (user.active == false)
        return res.status(419).send('Validate your account !');

    if (!user.password)
        return res.status(417).send('You can only log in using oAuth !');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(418).send('Invalid password !');

    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);
    return res.status(200).json({
        token
    });
});

router.get('/:hash1', async (req, res) => {
    const hash = req.params.hash1;
    const user = await User.findOne({
        activeHash: hash
    });

    const query = {
        activeHash: hash
    };
    user.active = true;
    User.findOneAndUpdate(query, user, {
        upsert: true
    }, function (err, doc) {
        if (err) return res.send(500, {
            error: err
        });
        return res.status(200).send('Email confirmed!')
    });
});

router.post('/oauth', async (req, res) => {
    var {
        google
    } = require('googleapis');
    var OAuth2 = google.auth.OAuth2;
    if (!req.header('jwt')) {
        // Tentative de connexion ou de création de compte
        const oauthName = req.body.oauth;
        if (oauthName == "google") {
            var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8081");
            r = await oauth2Client.getToken(req.body.refresh_token);
            oauth2Client.setCredentials(r.tokens);
            people = google.people('v1');
            result = await people.people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses',
                auth: oauth2Client
            });
            mail = result.data.emailAddresses[0].value
        }
        if (oauthName == "github") {
            if (req.body.refresh_token.length == 20) { // Front
                access_token = await GithubController.getGithubAccessToken(req.body.refresh_token);
                mail = await GithubController.getGithubEmail(access_token);
            } else { // Mobile
                mail = await GithubController.getGithubEmail(req.body.refresh_token);
            }
        }
        if (oauthName == "facebook") {
            mail = await FacebookController.getFacebookEmail(req.body.refresh_token);
        }

        const user = await User.findOne({
            email: mail
        });

        if (user) {
            console.log("oAuth: User found")

            if (user.active == false)
                return res.status(419).send();

            const token = jwt.sign({
                _id: user._id
            }, process.env.TOKEN_SECRET)
            return res.status(200).json({
                token
            });
        } else if (!user) {
            console.log("oAuth: User not found")

            var result
            var r

            const emailExist = await User.findOne({
                email: mail
            })
            if (emailExist) return res.status(402).send('Email already exist !')

            const salt = await bcrypt.genSalt(10)

            const hashActive = await bcrypt.hash(mail, salt)

            const user = new User({
                username: mail,
                email: mail,
                active: true,
                activeHash: hashActive.replace(/[^0-9a-z]/gi, '')
            });

            if (oauthName == "google") {
                user.oauth.google = {
                    googleId: result.data.resourceName.split("/")[1],
                    refresh_token: r.tokens.refresh_token,
                    code: req.body.refresh_token
                }
            }
            if (oauthName == "github") {
                if (req.body.refresh_token.length == 20) {
                    user.oauth.github = {
                        githubId: "",
                        refresh_token: access_token
                    }
                } else {
                    user.oauth.github = {
                        githubId: "",
                        refresh_token: req.body.refresh_token
                    }
                }
            }
            if (oauthName == "facebook") {
                user.oauth.facebook = {
                    facebookId: req.body.id,
                    refresh_token: req.body.refresh_token
                }
            }

            try {
                const token = jwt.sign({
                    _id: user._id
                }, process.env.TOKEN_SECRET)
                await user.save();
                return res.status(200).json({
                    token
                });
            } catch (err) {
                return res.status(400).send(err)
            }
        }
    } else {
        auth(req, res)
        // Lié un compte oauth
        const oauthName = req.body.oauth;
        const refresh_token = req.body.refresh_token;
        if (!oauthName || (!refresh_token && oauthName != "spotify") || (oauthName != "google" && oauthName != "spotify" && oauthName != "github" && oauthName != "facebook")) return res.status(421).send('Args error');

        const path = "oauth." + oauthName + ".refresh_token";
        const results = await User.findOne({
            _id: req.user._id,
            [path]: refresh_token
        });

        if (results) {
            return res.status(200).send();
        } else {
            console.log(req.body);
            const user = await User.findOne({
                _id: req.user._id
            });
            if (!user) return res.status(420).send();

            if (oauthName == "google") {
                var {
                    google
                } = require('googleapis');

                var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8081");
                const r = await oauth2Client.getToken(refresh_token);

                oauth2Client.setCredentials(r.tokens);

                people = google.people('v1');

                const res = await people.people.get({
                    resourceName: 'people/me',
                    personFields: 'emailAddresses',
                    auth: oauth2Client
                });

                user.oauth.google = {
                    googleId: res.data.resourceName.split("/")[1],
                    refresh_token: r.tokens.refresh_token,
                    code: refresh_token
                }
            }
            if (oauthName == "spotify") {
                user.oauth.spotify = {
                    spotifyId: "",
                    refresh_token: refresh_token
                }
            }
            if (oauthName == "github") {
                if (req.body.refresh_token.length == 20) {
                    user.oauth.github = {
                        githubId: "",
                        refresh_token: await GithubController.getGithubAccessToken(req.body.refresh_token)
                    }
                } else {
                    user.oauth.github = {
                        githubId: "",
                        refresh_token: req.body.refresh_token
                    }
                }
            }
            if (oauthName == "facebook") {
                user.oauth.facebook = {
                    facebookId: req.body.id,
                    refresh_token: refresh_token
                }
            }
            try {
                await user.save();
                return res.status(200).send();
            } catch (err) {
                return res.status(400).send();
            }
        }
    }
});

module.exports = router;