const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
const fetch = require("node-fetch")
const {
    NotificationMail
} = require("../../controllers/NotificationMail")
const FacebookController = require("../../controllers/FacebookController.js")

var TIMER = 1000

mongoose.connect("mongodb+srv://admin:46Ob7O6UuQeDocwA@cluster0.al9tm.mongodb.net/data?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

parentPort.on('message', (value) => {
    if (value === 'end')
        process.exit(0);
    else {
        args = value.split('/')
        TIMER = args[0]
        ID = args[1]
        accessToken = ""
        var last = {};
        setInterval(async () => {
            const user = await User.findOne({
                _id: ID,
                "composant.fctId": "21"
            })
            if (user) {
                for (var i = 0; i < user.composant.length; ++i)
                    if (user.composant[i].fctId == "21")
                        group = user.composant[i].args[0]
                FacebookController.getGroupIdByName(group, user.oauth.facebook.refresh_token).then((id) => {
                    if (id != -1) {
                        FacebookController.checkGroupActivity(id, user.oauth.facebook.refresh_token).then((status) => {
                            if (status > 0) {
                                const mail = "Nouveau message non lu dans le groupe " + group + ".";
                                NotificationMail(user.email, mail);
                            }
                        })
                    }
                })
            } else {
                parentPort.postMessage("END")
                process.exit(0)
            }
        }, TIMER * 1000);
    }
});