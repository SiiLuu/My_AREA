const router = require('express').Router();

router.get('/about.json', (req, res) => {
    res.json({
        client: {
            host: req.connection.remoteAddress
        },
        server: {
            current_time: (new Date).getTime(),
            services: [{
                name: "Google",
                widgets: [{
                    name: "no_name1",
                    description: "Track last email, delete the email if it comes from a certain email address",
                    params: [{
                        name: "email",
                        type: "string"
                    }]
                },
                {
                    name: "no_name2",
                    description: "Track last email, star when i receive a new message from an email address",
                    params: [{
                        name: "email",
                        type: "string"
                    }]
                }]
            }, 
            {
                name: "Spotify",
                widgets: [{
                    name: "no_name1",
                    description: "Track user follow a playlist, star all the sounds of your top artists in the playlist",
                    params: []
                },
                {
                    name: "no_name2",
                    description: "Tracke user create a playlist, add the top tracks of a specified artist to the playlist",
                    params: [{
                        name: "artist",
                        type: "string"
                    }]
                }]
            },
            {
                name: "Facebook",
                widgets: [{
                    name: "no_name1",
                    description: "Tracking posting of a page or group managed by the user, sending a notification to the user when a page or a group is posting",
                    params: []
                },
                {
                    name: "no_name2",
                    description: "Sending a notification when the actual day has anniversaries",
                    params: []
                }]
            },
            {
                name: "Football",
                widgets: [{
                    name: "no_name1",
                    description: "Live scores, send a notification as soon as there is a goal",
                    params: []
                },
                {
                    name: "no_name2",
                    description: "Live scores, sends an email if a match changes status in a particular division",
                    params: []
                }]
            },
            {
                name: "Aviationstack",
                widgets: [{
                    name: "no_name1",
                    description: "Observe the airport, send an email when new data arrives",
                    params: [{
                        name: "airport_code",
                        type: "string"
                    }]
                },
                {
                    name: "no_name2",
                    description: "Observe a flight, send an email when new data arrives",
                    params: [{
                        name: "flight_code",
                        type: "string"
                    }]
                }]
            },
            {
                name: "Github",
                widgets: [{
                    name: "no_name1",
                    description: "New push in a repository",
                    params: []
                },
                {
                    name: "no_name2",
                    description: "Favorite the repository (Reaction) that the user X just created (Action)",
                    params: []
                }]
            },
            {
                name: "OpenWeather",
                widgets: [{
                    name: "no_name1",
                    description: "",
                    params: []
                },
                {
                    name: "no_name2",
                    description: "",
                    params: []
                }]
            },
            ]
        }
    })
});

module.exports = router;