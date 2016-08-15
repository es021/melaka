var express = require('express'),
app = express();

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/www/index.html");
});

app.use(express.static(__dirname + '/www'));

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


var fs = require('fs'),
configPath = './app.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig=  parsed;
//console.log(parsed);
