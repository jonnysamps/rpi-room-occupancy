var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var to = ["someemail@somedomain.com"];
var from = "someemail@somedomain.com";

module.exports = {
    sendAlert: function(occupancy){
	var transport = nodemailer.createTransport(smtpTransport({
	    service: 'gmail',
	    auth: {
		user: "username",
		pass: "password"
	    }
	}));
	
	transport.sendMail({
	    from: from,
	    to: to,
	    subject: "Occupancy Changed: "+occupancy,
	    text: "Occupancy Changed: "+occupancy,
	}, function(err, info){
	    if (err){
		console.error("Error sending email: "+err);
	    } else {
		console.log("Email Sent!",info);
	    }
	});
    }   
}