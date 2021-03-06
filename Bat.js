makeChild("Bat","Actor");

/**
 * class representing a Bat which wanders around
 * @param x: the starting center x coordinate of the bat
 * @param y: the starting center y coordinate of the bat
 * @param cnv: the canvas to which this actor belongs
 */
function Bat(x,y,cnv) {
	Actor.call(this,x,y,"bat.png",cnv,null,null,null,60);
	this.debugColor = "#DD4400";
	this.state = "wander";
}