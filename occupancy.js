require('./util');
var ir = require('./ir');

var occupancy_timeout = process.env.OCCUPANCY_TIMEOUT || 20000;


/**
 * DEPRECATED... old algorithm... wasn't good.
 */
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

var occupied = false;
function setOccupied(value){
    if(occupied !== value){
	occupied = value;
	console.log("**** Occupancy Changed: "+occupied);
	alertListeners();
    }
}

function alertListeners(){
    for(var i in listeners){
	listeners[i](occupied);
    }
}
var running = false;
var thresholds = {occupied: .2,
		  unoccupied: 0};
var pollTime = 1000;
var windowSize = 30; // 
var slidingWindow = [].fill(false, 0, windowSize-1);
var windowPosition = 0;
function pollIR(){
    var irState = ir.status();
    slidingWindow[windowPosition] = irState;

    var count = 0.0;
    slidingWindow.map(function(value){
	count += value?1:0;
    });

    var movementRatio = count / windowSize;
    console.log("Movement Ratio: "+movementRatio);

    /**
     * This deserves some explanation: if we cross the occupied threshold then we'll set occupied to true
     * and if we cross the unoccupied threshold then we set occupied to false... if it is in between those
     * then we'll hold off making a judgement.
     */
    if(isOccupied(movementRatio))
	setOccupied(true)
    else if(isUnoccupied(movementRatio))
	setOccupied(false)

    if(running){
	windowPosition = (windowPosition + 1) % windowSize;
	setTimeout(pollIR, pollTime);
    }
}

function isOccupied(movementRatio){
    return movementRatio >= thresholds.occupied;
}

function isUnoccupied(movementRatio){
    return movementRatio <= thresholds.unoccupied;
}

	    

var listeners = [];
module.exports = {
    start: function(){
	ir.start();
	running = true;
	pollIR();
    },
    stop: function(){
	ir.stop();
	running = false;
    },
    onChange: function(cb){
	listeners.push(cb);
    },
    status: function(){
	return occupied;
    }
}