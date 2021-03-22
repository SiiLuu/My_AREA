const router = require('express').Router();
const auth = require('../controllers/AuthController.js');
const User = require('../models/UserModel');
const GithubController = require("../controllers/GithubController.js")

router.get('/github_email', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(420).send();
    GithubController.getGithubEmail(user.oauth.github.refresh_token);
});

module.exports = router;