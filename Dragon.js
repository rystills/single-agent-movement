/**
 * update the dragon
 */
Dragon.prototype.update = function() {
	this.rot = (this.rot + this.angVel * deltaTime) % 360;
	moveForward(this);
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
	this.rot = 0;
	this.vel = 50;
	this.angVel = 75;
}