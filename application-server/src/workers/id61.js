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
        iata_code = 0
        var last = {}
        setInterval(async () => {
            var user = await User.findOne({
                _id: ID,
                "composant.fctId": "61"
            }).then(async (res) => {
                if (res) {
                    for (var i = 0; i < res.composant.length; i++)
                        if (res.composant[i].fctId == "61") {
                            iata_code = res.composant[i].args[0]
                            user = 1
                        }
                }
                if (user) {
                    fetch("http://api.aviationstack.com/v1/flights?access_key=3ce43468ef18e736930d44703c2f6d0c&arr_iata=" + iata_code, {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json'
                        },
                    }).then((res) => {
                        res.json().then((data) => {
                                console.log("Data loading...")
                                const nowDate = new Date().toLocaleDateString("fr-FR")
                                const nowTime = new Date().toLocaleTimeString("fr-FR")
                                var lowestTime = "23:59:59";
                                var temp = {};
                                for (let i = 0; data.data.length > i; i++) {
                                    const arrivedDate = new Date(data.data[i].arrival.estimated).toLocaleDateString("fr-FR")
                                    const arrivedTime = new Date(data.data[i].arrival.estimated).toLocaleTimeString("fr-FR")
                                    if (arrivedDate == nowDate)
                                        if (arrivedTime < lowestTime && arrivedTime > nowTime) {
                                            lowestTime = arrivedTime;
                                            temp = data.data[i];
                                        }
                                }
                                if (JSON.stringify(temp) !== JSON.stringify(last)) {
                                    console.log("New data detected")
                                    last = temp
                                    const mail = "Notification d'un composant<br>La date d'arrivé du vol " + temp.flight.iata + " au départ de " + temp.departure.airport + " et a destination de " + temp.arrival.airport + " est prévue pour le " + temp.arrival.estimated
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