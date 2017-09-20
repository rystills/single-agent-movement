makeChild("Dragon","Actor");

/**
 * class representing a Dragon which chases the bat
 * @param x: the starting center x coordinate of the dragon
 * @param y: the starting center y coordinate of the dragon
 * @param cnv: the canvas to which this actor belongs
 */
function Dragon(x,y,cnv,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,cnv,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "dragon.png";
	this.debugColor = "#22FF00";
	this.state = "pursue";
}