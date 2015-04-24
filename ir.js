var gpio = require('rpi-gpio');
var logger = require('./logger').console;

var pin = 11;

function waitToSettle(callback){
    gpio.read(pin, function(err, result){
	if(err){
	    logger.info(err);
	    process.exit(1);
	}

	if(result)
	    waitToSettle(callback)
	else
	    callback()
    });
}

var listeners = [];
var running = false;
var current = false;
var previous = false;
function pollPIR(){
    gpio.read(pin, function(err, result){
	current = result;

	if(current != previous){
	    toggleState();
	}

	if(running)
	    setTimeout(pollPIR, 0.01);
    });
}

function toggleState(){
    previous = !previous;
    alertListeners();
}

function alertListeners(){
    for(var i in listeners){
        listeners[i](current);
    }
}

module.exports = {
    start: function(){
	running = true;
	gpio.setup(pin, gpio.DIR_IN, function(err) {
	    if(err){
		logger.error(err);
		process.exit(1);
	    }
	    logger.info("Pin setup. Waiting for the PIR to settle ....");
	    waitToSettle(pollPIR);
	});
    },
    stop: function(){
	running = false;
    },
    onChange: function(cb){
	listeners.push(cb);
    },
    status: function(){
	return current;
    }
}