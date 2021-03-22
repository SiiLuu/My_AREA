const jwt = require('jsonwebtoken');

module.exports = function auth (req, res, next) {
    const token = req.header('jwt');
    if (!token) return res.status(420).send();

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        if (next)
            next();
    } catch(err) {
        res.status(420).send();
    };
};
