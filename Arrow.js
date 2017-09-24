makeChild("Arrow","Actor");

/**
 * class representing an arrow which moves around on a path, with dynamic arrive at the two end locations
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 * @param cnv: the canvas to which this actor belongs
 */
function Arrow(x,y,cnv) {
	Actor.call(this,x,y,"arrow.png",cnv,0,130,200);
	this.debugColor = "#DD4400";
	this.state = "follow path";
	this.path = new Path([[10,10],[300,50],[-100,500], [300,250],[-225,240],[-450,280]],true);
	this.nextPoint = null;
	this.slowRadius = 115;
}