var restify = require('restify');
var mailer = require('./mailer');
var poster = require('./poster');
var occupancy = require('./occupancy');
var logger = require('./logger').console;

occupancy.onChange(function(state){
    poster.sendAlert(state);
});

occupancy.start();

function respond(req, res, next) {
    logger.debug("Responding with: "+occupancy.status());
    res.send(occupancy.status());
    next();
}

var server = restify.createServer();
server.get('/', respond);


server.listen(process.env.SERVER_PORT || 8080, function() {
    logger.info('%s listening at %s', server.name, server.url);
}); 