makeChild("Dragon","Actor");

/**
 * class representing a Dragon which guards the gold and chases the knight
 * @param x: the starting center x coordinate of the dragon
 * @param y: the starting center y coordinate of the dragon
 * @param cnv: the canvas to which this actor belongs
 */
function Dragon(x,y,cnv) {
	Actor.call(this,x,y,"dragon.png",cnv,0,60,120);
	this.debugColor = "#22FF00";
	this.state = "pursue";
	this.target = null;
	this.slowRadius = 75;
}