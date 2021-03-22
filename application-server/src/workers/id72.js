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
        repository = ""
        var last = [];
        setInterval(async () => {
            var user = await User.findOne({
                _id: ID,
                "composant.fctId": "72"
            }).then(async (res) => {
                if (res) {
                    for (var i = 0; i < res.composant.length; i++)
                        if (res.composant[i].fctId == "72") {
                            repository = res.composant[i].args[0]
                            user = 1
                        }
                }
                if (user) {
                    fetch("https://live-score-api.p.rapidapi.com/scores/live.json?league=" + repository + "&secret=tlM3NCqkbySljQbdIuQdZ7tuSvFIBMe4&key=USiDvvgfuK1bQ67w", {
                            "method": "GET",
                            "headers": {
                                "x-rapidapi-key": "2690a08c67msh82e200da148b04fp16a1e1jsn7a04d584be3d",
                                "x-rapidapi-host": "live-score-api.p.rapidapi.com"
                            }
                        })
                        .then((res) => {
                            res.json().then((data) => {
                                    console.log("Loading data")
                                    var temp = []
                                    for (let i = 0; data.data.match.length > i; i++)
                                        temp.push([data.data.match[i].id, data.data.match[i].last_changed, data.data.match[i].score, data.data.match[i].away_name, data.data.match[i].home_name, data.data.match[i].status])
                                    if (JSON.stringify(temp) !== JSON.stringify(last)) {
                                        console.log("New data detected")
                                        var mail = "Notification d'un composant<br>"
                                        for (let index = 0; index < temp.length; index++) {
                                            similar = true
                                            for (let y = 0; y < last.length; y++) {
                                                if (temp[index][0] == last[y][0] && temp[index][5] == last[y][5]) {
                                                    similar = true
                                                    break
                                                } else
                                                    similar = false
                                            }
                                            if (last.length == 0 || similar == false)
                                                mail += "Le match : " + temp[index][3] + " - " + temp[index][4] + " vient de changer de statut " + temp[index][5] + "<br>"
                                        }
                                        last = temp
                                        if (data.data.match.length >= 0) {
                                            NotificationMail(res.email, mail)
                                            console.log("Mail sended")
                                        }
                                    }
                                })
                                .catch((err) => console.error(err));
                        })
                        .catch(err => {
                            console.error(err);
                        });
                } else {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
            })
        }, TIMER * 1000);
    }
});

/*
http://livescore-api.com/api-client/fixtures/leagues.json?secret=EntLa1bw8iqrlKFignDZFNnXda0tKeoo&key=XvIlJh9oipM2fzeV
Ligue 1 
46
Premier League
25
Bundesligua
114
Liga
74
Serie A
73
*/