makeChild("Bat","Actor");

/**
 * class representing a Bat which flees from the dragon
 * @param x: the starting center x coordinate of the bat
 * @param y: the starting center y coordinate of the bat
 * @param cnv: the canvas to which this actor belongs
 */
function Bat(x,y,cnv) {
	Actor.call(this,x,y,"bat.png",cnv);
	this.debugColor = "#DD4400";
	this.state = "evade";
	this.target = null;
}