var request = require('request');

module.exports = {
    toTimestamp: function(date) {
        var year = date.split("T")[0].split("-")[0]
        var month = date.split("T")[0].split("-")[1]
        var day = date.split("T")[0].split("-")[2]
        var hour = date.split("T")[1].split("Z")[0].split(":")[0]
        var minute = date.split("T")[1].split("Z")[0].split(":")[1]
        var second = date.split("T")[1].split("Z")[0].split(":")[2]
        var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
        return datum.getTime()/1000;
    },
    getGithubAccessToken: function(code) {
        var clientId = process.env.GITHUB_CLIENT_ID;
        var clientSecret = process.env.GITHUB_CLIENT_SECRET;
        var options = {
            url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
        }
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject (error);
                    resolve(data.split('=')[1].split(('&'))[0]);
                })
            }
        )
    },
    getGithubUserRepos: function(token) {
        var clientId = process.env.GITHUB_CLIENT_ID;
        var clientSecret = process.env.GITHUB_CLIENT_SECRET;
        var options = {
            url: `https://api.github.com/user/repos`,
            headers: {
                'user-agent': 'node-js',
                'Authorization': 'token ' + token
            }
        }
        let ts = Date.now()/1000;
        var time;
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject (error);
                    obj = JSON.parse(data);
                    for (let i = 0; i < obj.length; i++) {
                        time = module.exports.toTimestamp(obj[i].created_at)
                        if (ts - time < 80) {
                            if (obj[i].stargazers_count < 1)
                                resolve(obj[i].full_name);
                            else
                                resolve(-2);
                        }
                    }
                    resolve(-1);
                })
            }
        )
    },
    starRepository: function(token, name) {
        var options = {
            url: `https://api.github.com/user/starred/${name}`,
            method: 'PUT',
            headers: {
                'user-agent': 'node-js',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token,
                'Content-Length': 0,
            }
        }
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error) {
                        reject (error);
                    }
                    if (response.statusCode == 204) {
                        resolve(0);
                    }
                    resolve(data);
                })
            }
        )
    },
    checkUpdatedRepository: function(token, name, timer) {
        var options = {
            url: `https://api.github.com/user/repos`,
            headers: {
                'user-agent': 'node-js',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token,
            }
        }
        var time;
        let ts = Date.now()/1000;
        console.log(name);
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject (error);
                    var obj = JSON.parse(data);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].name == name) {
                            time = module.exports.toTimestamp(obj[i].pushed_at);
                            if (ts - time < timer + 1.2) {
                                resolve(0);
                            }
                        }
                    }
                    resolve(-1);
                })
            }
        )
    },
    getGithubEmail: function(token) {
        var options = {
            url: `https://api.github.com/user/emails`,
            headers: {
                'user-agent': 'node-js',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token ' + token
            }
        }
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject (error);
                    obj = JSON.parse(data);
                    for (let i = 0; i < obj.length; i++) {
                        if (obj[i].visibility != null)
                            resolve(obj[i].email);
                    }
                    resolve(-1);
                })
            }
        )
    }
}