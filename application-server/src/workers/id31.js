const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')
var {
    google
} = require('googleapis');
var gmail = google.gmail('v1');
var OAuth2 = google.auth.OAuth2;

var TIMER = 1000

// https://developers.google.com/oauthplayground/
// Avoir un id
// scope: https://www.googleapis.com/auth/userinfo.profile
// request: https://www.googleapis.com/plus/v1/people/me

// https://developers.google.com/gmail/api/reference/rest/v1/users.messages/modify

function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

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
        var email

        const userr = await User.findOne({
            _id: ID,
            "composant.fctId": "31"
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
            email = resu.data.emailAddresses[0].value
            console.log("Get email and id of google account")
        })

        setInterval(async () => {
                var user = await User.findOne({
                    _id: ID,
                    "composant.fctId": "31"
                }).then(async (res) => {
                    if (res) {
                        for (var i = 0; i < res.composant.length; i++)
                            if (res.composant[i].fctId == "31")
                                user = 1
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
                            function (err, response) {
                                console.log("get email list")
                                if (response.data.messages[0].id != lastMail && lastMail != "") {
                                    gmail.users.messages.modify
                                    gmail.users.messages.get({
                                            userId: gId,
                                            id: response.data.messages[0].id,
                                            auth: oauth2Client
                                        },
                                        function (err, response) {
                                            var temp = ""
                                            for (let i = 0; i < response.data.payload.headers.length; i++) {
                                                temp = ""
                                                if (response.data.payload.headers[i].name == 'From') {
                                                    if (response.data.payload.headers[i].value.split("<").length < 2)
                                                        continue
                                                    console.log("Find the last email")
                                                    from = response.data.payload.headers[i].value.split("<")[1].slice(0, -1)
                                                    var raw = makeBody(from, email, 'Actuellement en vacance', 'Je suis actuellement en congé je ne repondrais pas à votre mail dessuite, si celui-ci est important contactez mon collègue ici : Aboubacar');
                                                    gmail.users.messages.send({
                                                        auth: oauth2Client,
                                                        userId: gId,
                                                        resource: {
                                                            raw: raw
                                                        }
                                                    });
                                                    console.log("Email sended")
                                                }
                                            }
                                        }
                                    );
                                }
                                lastMail = response.data.messages[0].id
                            }
                        );
                    } else {
                        parentPort.postMessage("END")
                        process.exit(0)
                    }
                })
            },
            TIMER * 1000);
    }
});