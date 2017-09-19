/**
 * update the knight
 */
Knight.prototype.update = function() {
	console.log("knight update");
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
}