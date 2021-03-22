const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
const fetch = require("node-fetch")
const {
    NotificationMail
} = require("../../controllers/NotificationMail")

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
            console.log("Timer: " + TIMER)
            const user = await User.findOne({
                _id: ID,
                "composant.fctId": "id82"
            })
            if (user) {
                for (var i = 0; i < user.composant.length; ++i)
                    if (user.composant[i].fctId == "id_82")
                        appId = user.composant[i].args[0]
                        city = user.composant[i].args[1]
                if (!appId) {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
                var request = require('request');
                var options = {
                    url: "pro.openweathermap.org/data/2.5/forecast/hourly?q=" + city + "&appid=" + appId
                };
                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const mail = "Weather updated hourly: " + body;
                        NotificationMail(user.email, mail)
                    } else {
                        console.log(error);
                    }
                }
                
                request(options, callback);
            } else {
                parentPort.postMessage("END")
                process.exit(0)
            }
        }, TIMER * 1000);
    }
});