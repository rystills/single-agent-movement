makeChild("Bat","Actor")

/**
 * class representing a Bat which wanders and flees from the knight
 * @param x: the starting center x coordinate of the bat
 * @param y: the starting center y coordinate of the bat
 * @param cnv: the canvas to which this actor belongs
 */
function Bat(x,y,cnv,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,cnv,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "bat.png";
	this.debugColor = "#DD4400";
}