makeChild("Bat","Actor")

/**
 * class representing a Bat which wanders and flees from the knight
 * @param x: the starting center x coordinate of the bat
 * @param y: the starting center y coordinate of the bat
 */
function Bat(x,y,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "bat.png";
}