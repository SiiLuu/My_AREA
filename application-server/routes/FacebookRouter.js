const router = require('express').Router();
const auth = require('../controllers/AuthController.js');
const User = require('../models/UserModel');
const FacebookController = require("../controllers/FacebookController.js")
const GithubController = require("../controllers/GithubController.js")

router.get('/group_list', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();
    var token = ""
    var groups = []
    var request = require('request');
    var options = {
        url: 'https://graph.facebook.com/v9.0/me?fields=groups&access_token=' + token
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            obj = JSON.parse(data);
            for (let i = 0; i < obj.data.length; i++) {
                groups.push(obj.data[i].name);
            }
            res.status(200).send(groups);
        }
    }
    request(options, callback);
});

module.exports = router;