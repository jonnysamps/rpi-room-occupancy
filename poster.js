var https = require('https');
var service = module.exports = {
    sendAlert: function(occupied){
	var postData = JSON.stringify({
	    text: "Ping Pong Table: *"+(occupied?'':'un')+"occupied*",
	    username: "Hall Monitor Bot",
	    icon_emoji: occupied?":pingpong:":":no_entry:"
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
	
	var req = https.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	    });
	});
	
	req.on('error', function(e) {
	    console.log('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write(postData);
	req.end();
    }
}