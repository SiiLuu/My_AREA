var request = require('request');

module.exports = {
    getGroupIdByName: function(name, token) {
        var id = "";
        var options = {
            url: 'https://graph.facebook.com/v9.0/me/groups?access_token=' + token
        };
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject(error);
                    var obj = JSON.parse(data);
                    for (let i = 0; i < obj.data.length; i++) {
                        if (obj.data[i].name == name) {
                            var id = obj.data[i].id;
                            resolve(id);
                        }
                    }
                    resolve(-1);
                })
            }
        )
    },
    checkGroupActivity: function(id, token) {
        var options = {
            url: 'https://graph.facebook.com/v9.0/me/groups?fields=unread&access_token=' + token
        };
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject(error);
                    var obj = JSON.parse(data);
                    for (let i = 0; i < obj.data.length; i++) {
                        if (obj.data[i].id == id) {
                            resolve(obj.data[i].unread);
                        }
                    }
                    resolve(-1);
                })
            }
        )
    },
    getFacebookEmail: function(token) {
        var email = "";
        var options = {
            url: 'https://graph.facebook.com/v9.0/me?fields=email&access_token=' + token
        };
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject(error);
                    obj = JSON.parse(data);
                    console.log(obj);
                    if (obj.email)
                        resolve(obj.email);
                    resolve(-1);
                })
                
            }
        )
    }
}