/**
 * update the dragon
 */
Dragon.prototype.update = function() {
	console.log("dragon update");
}

/**
 * class representing a Dragon which wanders and chases the player
 * @param x: the starting center x coordinate of the dragon
 * @param y: the starting center y coordinate of the dragon
 */
function Dragon(x,y) {
	//initialize state
	this.state = "wander";
	this.x = x;
	this.y = y;
}