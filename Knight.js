makeChild("Knight","Actor")

/**
 * class representing a knight which wanders and chases the bat, while fleeing from the dragon
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 */
function Knight(x,y,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "knight.png";
	this.debugColor = "#BBBBBB";
}