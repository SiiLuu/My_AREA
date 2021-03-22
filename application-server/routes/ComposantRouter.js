const router = require('express').Router();
const auth = require('../controllers/AuthController.js');
const User = require('../models/UserModel');
const worker = require('../src/workers/Worker')

router.get('/composant_list', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    var composants = []
    for(var i = 0; i < user.composant.length; ++i)
        composants.push({
            "name": user.composant[i].name,
            "timer": user.composant[i].timer,
            "fctId": user.composant[i].fctId
          })
    const result = {
        "composant": composants
    }
    return res.status(200).send(result);
});

router.post('/subscribe_composant', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    const name = req.body.name
    const fctId = req.body.fctId
    const timer = req.body.timer
    const args = req.body.args

    if (fctId != 21 && fctId != 31 && fctId != 32 && fctId != 41 && fctId != 81 && fctId != 42 &&
        fctId != 51 && fctId != 52 && fctId != 61 && fctId != 62 && fctId != 71 && fctId != 72)
        return res.status(422).send()

    if (!name || !fctId || !timer)
        return res.status(422).send()

    var service = ""

    if (fctId == 21)
        service = "facebook"
    if (fctId == 31 || fctId == 32)
        service = "google"
    if (fctId == 41 || fctId == 42)
        service = "github"
    if (fctId == 51 || fctId == 52)
        service = "spotify"
    if (fctId == 61 || fctId == 62)
        service = "aviationstack"
    if (fctId == 71 || fctId == 72)
        service = "football"
    if (fctId == 81)
        service = "openweather"

    if (service == "")
        return res.status(423).send()

    const resultf = await User.findOne({ _id: req.user._id, "composant.fctId": fctId });
    if (!resultf) {
        user.composant.push({
            fctId: fctId,
            service: service,
            name: name,
            timer: timer,
            args: args
        })

        worker('./src/workers/id' + fctId + '.js', timer, req.user._id)

        try {
            await user.save();
            return res.status(200).send();
        } catch(err) {
            return res.status(400).send();
        }
    }
    return res.status(421).send();
});

router.delete('/unsubscribe_composant', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();

    const fctId = req.body.fctId

    if (!fctId)
        return res.status(422).send()

    const results = await User.findOne({ _id: req.user._id, "composant.fctId": fctId });
    if (results) {
        for(var i = 0; i < user.composant.length; ++i)
            if (user.composant[i].fctId == fctId)
                user.composant.splice(i, 1);

        try {
            await user.save();
            return res.status(200).send();
        } catch(err) {
            return res.status(400).send();
        }
    }
    return res.status(421).send();
});

module.exports = router;