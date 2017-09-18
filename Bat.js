/**
 * update the bat
 */
Bat.prototype.update = function() {
	console.log("bat update");
}

/**
 * class representing a bat which wanders and avoids the player
 * @param x: the starting center x coordinate of the bat
 * @param y: the starting center y coordinate of the bat
 */
function Bat(x,y) {
	//initialize state
	this.state = "wander";
	this.x = x;
	this.y = y;
}