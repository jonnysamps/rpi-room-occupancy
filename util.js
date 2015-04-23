/**
 * Monkey Patch Array to have the fill method
 */

Array.prototype.fill = function(value, start, end){
    for(var i = start; i < end; i++){
	this[i] = value
    }
    return this;
}