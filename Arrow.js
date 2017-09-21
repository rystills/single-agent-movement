makeChild("Arrow","Actor");

/**
 * class representing an arrow which moves around on a path, with dynamic arrive at the two end locations
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 * @param cnv: the canvas to which this actor belongs
 */
function Arrow(x,y,cnv,rot,accel, maxVel, angAccel, angMaxVel) {
	Actor.call(this,x,y,cnv,rot,accel,maxVel,angAccel,angMaxVel);
	this.imageName = "arrow.png";
	this.debugColor = "#000000";
	this.state = "follow path";
	this.path = new Path([[10,10],[200,30],[50,300]],true);
}