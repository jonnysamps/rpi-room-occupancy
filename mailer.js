var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var to = ["jonnysamps@gmail.com"];
var from = "jonnysamps@gmail.com";

module.exports = {
    sendAlert: function(occupancy){
	var transport = nodemailer.createTransport(smtpTransport({
	    service: 'gmail',
	    auth: {
		user: "jonnysamps",
		pass: "Helloworld24"
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