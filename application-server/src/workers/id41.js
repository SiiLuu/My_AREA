const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
const fetch = require("node-fetch")
const {
    NotificationMail
} = require("../../controllers/NotificationMail")
const GithubController = require("../../controllers/GithubController.js")
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
        var last = {};
        setInterval(async () => {
            console.log("Timer: " + TIMER)
            const user = await User.findOne({
                _id: ID,
                "composant.fctId": "41"
            })
            if (user) {
                GithubController.getGithubUserRepos(user.oauth.github.refresh_token).then((repo) => {
                    if (repo != -1 && repo != -2) {
                        GithubController.starRepository(user.oauth.github.refresh_token, repo).then((status) => {
                            if (status == 0) {
                                const mail = "Votre dépôt github " + repo + " à été ajouté à vos favoris.";
                                NotificationMail(user.email, mail);
                            }
                        });
                    }
                });
            } else {
                parentPort.postMessage("END")
                process.exit(0)
            }
        }, TIMER * 1000);
    }
});