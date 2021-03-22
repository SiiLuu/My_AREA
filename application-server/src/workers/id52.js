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
            "composant.fctId": "52"
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
                "composant.fctId": "52"
            }).then((res) => {
                var artist
                if (res) {
                    for (var i = 0; i < res.composant.length; i++)
                        if (res.composant[i].fctId == "52") {
                            artist = res.composant[i].args[0]
                            user = 1
                        }
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
                            console.log("Get user playlist")
                            // New playlist added detected
                            if (data.body.items[0] != lastPlaylistGet && data.body.total > lastTotal) {
                                // Obtenir mes tops artistes
                                playlistOwnerId = data.body.items[0].owner.id
                                playlistId = data.body.items[0].id
                                console.log("Playlist id: " + playlistId)
                                spotifyApi.getMe()
                                    .then(function (data) {
                                        // Playlist created by me
                                        if (data.body.id == playlistOwnerId) {
                                            console.log("Last playlist was created by owner")
                                            songToAdd = []
                                            spotifyApi.searchArtists(artist) // Changer sa par l'artiste envoyé par le front
                                                .then(function (data) {
                                                    artist = data.body.artists.items[0].id;
                                                    spotifyApi.getArtistTopTracks(artist, 'FR')
                                                        .then(function (data) {
                                                            for (let index = 0; index < data.body.tracks.length; index++) {
                                                                songToAdd.push(data.body.tracks[index].uri)
                                                            }
                                                            spotifyApi.addTracksToPlaylist(playlistId, songToAdd)
                                                                .then(function (data) {
                                                                    console.log('Added tracks to playlist!');
                                                                }, function (err) {
                                                                    console.log('Something went wrong!', err);
                                                                });
                                                        }, function (err) {
                                                            console.log('Something went wrong!', err);
                                                        });

                                                }, function (err) {
                                                    console.error(err);
                                                });
                                        }
                                    }, function (err) {
                                        console.log('Something went wrong!', err);
                                    });
                                //console.log(data.body.items[0])
                            }
                            lastPlaylistGet = data.body.items[0]
                            lastTotal = data.body.total
                        }, function (err) {
                            console.log('Something went wrong!', err);
                        });
                } else {
                    parentPort.postMessage("END")
                    process.exit(0)
                }
            })
        }, TIMER * 1000);
    }
});