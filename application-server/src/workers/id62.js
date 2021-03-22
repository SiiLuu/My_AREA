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
        flight_icao = 0
        var last = {};
        setInterval(async () => {
            var user = await User.findOne({
                _id: ID,
                "composant.fctId": "62"
            }).then(async (res) => {
                if (res) {
                    for (var i = 0; i < res.composant.length; i++)
                        if (res.composant[i].fctId == "62") {
                            flight_icao = res.composant[i].args[0]
                            user = 1
                        }
                }
                if (user) {
                    var temp = {};
                    await fetch("http://api.aviationstack.com/v1/flights?access_key=3ce43468ef18e736930d44703c2f6d0c&flight_icao=" + flight_icao, {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json'
                        },
                    }).then((res) => {
                        res.json().then((data) => {
                                console.log("Data loading...")
                                temp = data.data[0]
                                if (JSON.stringify(temp) !== JSON.stringify(last)) {
                                    last = temp
                                    const mail = "Notification d'un composant<br>Le vol " + flight_icao + " est actuellement avec le status suivant " + data.data[0].scheduled + " et a prévue d'atterir le " + data.data[0].arrival.scheduled
                                    NotificationMail(user.email, mail)
                                    console.log("Mail sended")
                                }

                            })
                            .catch((err) => console.error(err));
                    })
                } else {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
            })
        }, TIMER * 1000);
    }
});