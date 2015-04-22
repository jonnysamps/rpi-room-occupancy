var restify = require('restify');
var mailer = require('./mailer');
var poster = require('./poster');
var occupancy = require('./occupancy');

occupancy.onChange(function(state){
    poster.sendAlert(state);
});

occupancy.start();

function respond(req, res, next) {
    console.log("Responding with: "+occupancy.status());
    res.send(occupancy.status());
    next();
}

var server = restify.createServer();
server.get('/', respond);


server.listen(process.env.SERVER_PORT || 8080, function() {
    console.log('%s listening at %s', server.name, server.url);
}); 