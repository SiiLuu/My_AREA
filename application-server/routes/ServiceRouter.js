const router = require('express').Router();
const User = require('../models/UserModel');
const auth = require('../controllers/AuthController.js');

router.get('/subscribe_list', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    var services = []
    for(var i = 0; i < user.services.length; ++i)
        services.push(user.services[i].name)
    const result = {
        "services": services
    }
    return res.status(200).send(result);
});

router.post('/subscribe_service', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(401).send('Invalid jwt token !');

    const service = req.body.service

    const results = await User.findOne({ _id: req.user._id, "services.name": service });
    if (!results) {
        user.services.push({
            name: service
        })

        try {
            await user.save();
            return res.status(200).send()
        } catch(err) {
            return res.status(400).send()
        }
    } else return res.status(421).send()
});

router.delete('/unsubscribe_service', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    const service = req.body.service

    if (!service)
        return res.status(422).send()

    const results = await User.findOne({ _id: req.user._id, "services.name": service });
    if (results) {
        for(var i = 0; i < user.services.length; ++i)
            if (user.services[i].name == service)
                user.services.splice(i, 1);

        try {
            await user.save();
            return res.status(200).send();
        } catch(err) {
            return res.status(400).send();
        }
    } else return res.status(421).send();
});

router.get('/list_oauth', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    if (user) {
        var array = []
        if (user.oauth.google.refresh_token)
            array.push("google")
        if (user.oauth.github.refresh_token)
            array.push("github")
        if (user.oauth.facebook.refresh_token)
            array.push("facebook")
        if (user.oauth.spotify.refresh_token)
            array.push("spotify")

        try {
            return res.status(200).send(array);
        } catch(err) {
            return res.status(400).send();
        }
    } else return res.status(421).send();
});

module.exports = router;