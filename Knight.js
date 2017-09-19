/**
 * update the knight
 */
Knight.prototype.update = function() {
	this.rot = (this.rot + this.angVel * deltaTime) % 360;
	moveForward(this);
}

/**
 * class representing a Knight which wanders and chases the player
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 */
function Knight(x,y) {
	//initialize state
	this.state = "wander";
	this.x = x;
	this.y = y;
	this.rot = 0;
	this.vel = 200;
	this.angVel = 300;
}