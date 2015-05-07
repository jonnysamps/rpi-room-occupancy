var logger = require('./logger').console;
var https = require('https');
var service = module.exports = {
    sendAlert: function(occupied){
	var postData = JSON.stringify({
	    text: (occupied?':red_circle:':':sparkle:')+" *"+(occupied?'':'un')+"occupied*",
	    username: "Ping Pong Room",
	    icon_emoji: ":pingpong:",
	    channel: "#g5_pingpong",
	});
	
	var options = {
	    hostname: 'hooks.slack.com',
	    port: 443,
	    path: '/services/T025ZF3QJ/B04GP0Y0B/1q0yiLQxAOOFKYImXYa0uDeb',
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/json',
		'Content-Length': postData.length
	    }
	};
	
	logger.debug("Slack request: "+postData);
	var req = https.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		logger.debug('Slack resposne: ' + chunk);
	    });
	});
	
	req.on('error', function(e) {
	    logger.error('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write(postData);
	req.end();
    }
}