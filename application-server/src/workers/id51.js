var SpotifyWebApi = require('spotify-web-api-node');
const {
    parentPort
} = require('worker_threads')
const User = require('../../models/UserModel')
const mongoose = require('mongoose')

var TIMER = 1000

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

        var lastPlaylistGet = 0
        var lastTotal = 0
        const refresh_token = await User.findOne({
            _id: ID,
            "composant.fctId": "51"
        })
        var spotifyApi = new SpotifyWebApi({
            clientId: 'c3aa3b836ef74b49bd696a2d347d85ae',
            clientSecret: 'e5a9151acd2a4a019b008a94971cdc74',
            redirectUri: 'http://localhost:8081/service',
            refreshToken: refresh_token.oauth.spotify.refresh_token
        });
        setInterval(async () => {
                var user = await User.findOne({
                    _id: ID,
                    "composant.fctId": "51"
                }).then((res) => {
                    if (res) {
                        for (var i = 0; i < res.composant.length; i++)
                            if (res.composant[i].fctId == "51")
                                user = 1
                    }
                    if (user == 1) {
                        spotifyApi.refreshAccessToken().then(
                            function (data) {
                                console.log('The access token has been refreshed!');
                                // Save the access token so that it's used in future calls
                                spotifyApi.setAccessToken(data.body['access_token']);
                            },
                            function (err) {
                                console.log('Could not refresh access token', err);
                            }
                        );
                        spotifyApi.getUserPlaylists()
                            .then(function (data) {
                                myArtist = []
                                // New playlist added detected
                                console.log("Get all playlist")
                                if (data.body.items[0] != lastPlaylistGet) {
                                    console.log("New playlist added detected")
                                    // Obtenir mes tops artistes
                                    spotifyApi.getMyTopArtists()
                                        .then(function (data) {
                                            console.log("Get my top artist")
                                            // Boucler sur tout les artistes
                                            for (let index = 0; index < data.body.items.length; index++)
                                                myArtist.push(data.body.items[index].id)
                                        }, function (err) {
                                            console.log('Something went wrong!', err);
                                        });
                                    // Obtenir les artistes présent sur la playlist
                                    console.log("Loading artists on the playlist")
                                    spotifyApi.getPlaylist(data.body.items[0].id)
                                        .then(function (dataa) {
                                            // Boucler sur tout les sons
                                            // Boucler sur tout les artistes
                                            console.log("Loading songs and artists")
                                            for (let index = 0; index < dataa.body.tracks.items.length; index++) {
                                                for (let y = 0; y < dataa.body.tracks.items[index].track.artists.length; y++) {
                                                    // Si un artiste présent dans la playlist est dahs mon top artiste -> l'ajouter à mes sons préférés
                                                    if (myArtist.includes(dataa.body.tracks.items[index].track.artists[y].id) && lastPlaylistGet != 0 && data.body.total > lastTotal) {
                                                        spotifyApi.addToMySavedTracks([dataa.body.tracks.items[index].track.id])
                                                            .then(function () {
                                                                console.log('Added track!');
                                                            }, function (err) {
                                                                console.log('Something went wrong!', err);
                                                            });
                                                        continue
                                                    }
                                                }
                                            }
                                            lastPlaylistGet = data.body.items[0]
                                            lastTotal = data.body.total
                                        }, function (err) {
                                            console.log('Something went wrong!', err);
                                        });
                                }
                            }, function (err) {
                                console.log('Something went wrong!', err);
                            });
                    } else {
                        parentPort.postMessage("END")
                        process.exit(0)
                    }
                })
            },
            TIMER * 1000);
    }
});