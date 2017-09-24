makeChild("Knight","Actor");

/**
 * class representing a knight which approaches the gold and flees from the dragon
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 * @param cnv: the canvas to which this actor belongs
 */
function Knight(x,y,cnv) {
	Actor.call(this,x,y,"knight.png",cnv,0,75,150);
	this.debugColor = "#BBBBBB";
	this.state = "evade";
	this.target = null;
	this.slowRadius = 110;
}