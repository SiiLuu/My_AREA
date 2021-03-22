const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
const fetch = require("node-fetch")
const {
    NotificationMail
} = require("../../controllers/NotificationMail")
const { eventNames } = require('../../models/UserModel')
const OpenweatherController = require("../../controllers/OpenweatherController.js")
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
        var status = 0;
        var last = {};
        setInterval(async () => {
            const user = await User.findOne({
                _id: ID,
                "composant.fctId": "81"
            })
            if (user) {
                for (var i = 0; i < user.composant.length; ++i)
                    if (user.composant[i].fctId == "81") {
                        city = user.composant[i].args[0]
                    }
                if (!city) {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
                OpenweatherController.getWeather(city).then((temp) => {
                    if (temp < 10) {
                        const mail = "La température à " + city + " est en dessous de 10°c! Pensez à vous couvrir!";
                        NotificationMail(user.email, mail)
                    }
                })
                
            } else {
                parentPort.postMessage("END")
                process.exit(0)
            }
        }, TIMER * 1000);
    }
});