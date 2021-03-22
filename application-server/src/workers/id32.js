const {
    parentPort
} = require('worker_threads')
var {
    google
} = require('googleapis');
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
var gmail = google.gmail('v1');
var OAuth2 = google.auth.OAuth2;

var TIMER = 1000

// https://developers.google.com/oauthplayground/
// Avoir un id
// scope: https://www.googleapis.com/auth/userinfo.profile
// request: https://www.googleapis.com/plus/v1/people/me

var lastMail = ""

mongoose.connect("mongodb+srv://admin:46Ob7O6UuQeDocwA@cluster0.al9tm.mongodb.net/data?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

parentPort.on('message', async (value) => {
    if (value === 'end')
        process.exit(0);
    else {
        args = value.split('/')
        TIMER = args[0]
        ID = args[1]
        var gId

        const userr = await User.findOne({
            _id: ID,
            "composant.fctId": "32"
        }).then(async (res) => {
            var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8081");
            oauth2Client.credentials.refresh_token = res.oauth.google.refresh_token
            var accessToken = await oauth2Client.getAccessToken()
            oauth2Client.setCredentials(accessToken.res.data)
            people = google.people('v1');
            var resu = await people.people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses',
                auth: oauth2Client
            });
            gId = resu.data.resourceName.split("/")[1]
            console.log("Get email and id of google account")
        })

        setInterval(async () => {
            var user = await User.findOne({
                _id: ID,
                "composant.fctId": "32"
            }).then(async (res) => {
                var mailarg
                if (res) {
                    for (var i = 0; i < res.composant.length; i++)
                        if (res.composant[i].fctId == "32") {
                            mailarg = res.composant[i].args[0]
                            user = 1
                        }
                }
                if (user == 1) {
                    var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:8081");
                    oauth2Client.credentials.refresh_token = res.oauth.google.refresh_token
                    const at = await oauth2Client.getAccessToken()
                    oauth2Client.setCredentials(at.res.data)
                    gmail.users.messages.list({
                            userId: gId,
                            auth: oauth2Client
                        },
                        function (err, responsee) {
                            console.log("get email list")
                            gmail.users.messages.get({
                                    userId: gId,
                                    id: responsee.data.messages[0].id,
                                    auth: oauth2Client
                                },
                                function (err, response) {
                                    console.log(responsee)
                                    console.log("get email")
                                    var temp = ""
                                    for (let i = 0; i < response.data.payload.headers.length; i++) {
                                        temp = ""
                                        if (response.data.payload.headers[i].name == 'From') {
                                            if (response.data.payload.headers[i].value.split("<").length < 2)
                                                continue
                                            from = response.data.payload.headers[i].value.split("<")[1].slice(0, -1)
                                            console.log("Find the last email")
                                            if (responsee.data.messages[0].id != lastMail && from == mailarg && lastMail != "") {
                                                gmail.users.messages.modify
                                                gmail.users.messages.trash({
                                                    userId: gId,
                                                    auth: oauth2Client,
                                                    id: responsee.data.messages[0].id
                                                })
                                                console.log("Email deleted")
                                            }
                                        }
                                    }
                                    lastMail = responsee.data.messages[0].id
                                }
                            );
                        }
                    );
                } else {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
            })
        }, TIMER * 1000);
    }
});