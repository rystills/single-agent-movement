makeChild("Knight","Actor")

/**
 * class representing a knight which wanders and chases the bat, while fleeing from the dragon
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 * @param cnv: the canvas to which this actor belongs
 */
function Knight(x,y,cnv,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,cnv,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "knight.png";
	this.debugColor = "#BBBBBB";
}