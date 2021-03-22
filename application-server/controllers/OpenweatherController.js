var request = require('request');
const fetch = require("node-fetch");

module.exports = {
    getWeather: function(city) {
        appId = process.env.OPENWEATHER_APPID
        var options = {
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appId
        };
        return new Promise(
            (resolve, reject) => {
                request(options, function(error, response, data) {
                    if (error)
                        reject (error);
                    obj = JSON.parse(data);
                    resolve(obj.main.temp - 273.15);
                })
            }
        )
    }
}