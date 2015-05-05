require('./util');
var ir = require('./ir');
var logger = require('./logger');
var winston = logger.console;
var history = logger.history;

var occupied = false;
function setOccupied(value){
    if(occupied !== value){
	occupied = value;
	winston.info("Occupancy Changed: "+occupied);
	alertListeners();
    }
}

function alertListeners(){
    for(var i in listeners){
	listeners[i](occupied);
    }
}

var ov = 1;
var uv = -.174;
var running = false;
var thresholds = {occupied: 4.5,
		  unoccupied: -.8};
var pollTime = 1000;
var windowSize = 30; // 
var slidingWindow = [].fill(false, 0, windowSize);
var windowPosition = 0;
function pollIR(){
    var length = slidingWindow.unshift(ir.status());
    slidingWindow.pop();

    var movementRatio = getMovementRatio();

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

function weightedValue(index, value){
    return weight(index)*(value?ov:uv); 
}

function getMovementRatio(){
    var movementRatio =0;
    for(var i =0; i < windowSize; i++){
        movementRatio += weightedValue(i, slidingWindow[i]);
    }
    history.info(movementRatio);
    return movementRatio;
}

/**
 * Weight function to calculate the weight for each index
 */
function weight(index){
    return Math.pow((1/(index+1)),(2.0/3.0));
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

function runTests(){
    console.log("All Movement");
    slidingWindow.fill(true,0,windowSize);
    getMovementRatio();
    
    console.log("No movement");
    slidingWindow.fill(false,0,windowSize);
    getMovementRatio();
    
    console.log("Alternating");
    for(var i = 0; i < windowSize; i++)
	slidingWindow[i] = i%2==0;
    getMovementRatio();
    
    console.log("Alternating uv:-.5");
    uv = -.174
    for(var i = 0; i < windowSize; i++)
	slidingWindow[i] = i%2==0;
    getMovementRatio();
    
    console.log("First 2/3 unoccupied");
    for(var i = 0; i < windowSize; i++)
	slidingWindow[i] = i > windowSize*(2.0/3.0);
    getMovementRatio();
    
    console.log("first slot occupied");
    slidingWindow.fill(false,0, windowSize);
    slidingWindow.fill(true,0,10);
    getMovementRatio();
}

//runTests();
