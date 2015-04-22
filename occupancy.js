var ir = require('./ir');

var occupancy_timeout = process.env.OCCUPANCY_TIMEOUT || 10000;

var occupied = false;
var timeoutHandle = null;
function irChanged(state){
    // If we have started a timer then cancel it because the state has changed
    if(timeoutHandle){
	clearTimeout(timeoutHandle);
	timeoutHandle = null;
    }

    // if the IR state is different than the current occupied state then 
    // evaluate if we should change the occupied state
    if(state !== occupied){
	timeoutHandle = setTimeout(function(){
	    toggleOccupancy();
	}, occupancy_timeout);
    }
}

function toggleOccupancy(){
    occupied = !occupied;
    console.log("**** Occupancy Changed: "+occupied);
    alertListeners();
}

function alertListeners(){
    for(var i in listeners){
	listeners[i](occupied);
    }
}
	    

var listeners = [];
module.exports = {
    start: function(){
	ir.onChange(irChanged);
	ir.start();
    },
    stop: function(){
	ir.stop();
    },
    onChange: function(cb){
	listeners.push(cb);
    },
    status: function(){
	return occupied;
    }
}