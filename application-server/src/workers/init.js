const User = require('../../models/UserModel');
const worker = require('./Worker')

module.exports = async function init() {
    var userMap = [];
    // Get all users
    await User.find({}, function (err, users) {
        users.forEach(function (user) {
            userMap.push(user._id)
        });
    });

    for (let index = 0; index < userMap.length; index++) {
        const user = await User.findOne({ _id: userMap[index]});
        const result = user.composant
        for (let i = 0; i < result.length; i++) {
            worker('./src/workers/id' + result[i].fctId + '.js', result[i].timer, userMap[index])
        }
    }
};