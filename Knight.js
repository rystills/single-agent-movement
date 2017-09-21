makeChild("Knight","Actor");

/**
 * class representing a knight which wanders around
 * @param x: the starting center x coordinate of the knight
 * @param y: the starting center y coordinate of the knight
 * @param cnv: the canvas to which this actor belongs
 */
function Knight(x,y,cnv) {
	Actor.call(this,x,y,"knight.png",cnv);
	this.debugColor = "#BBBBBB";
	this.state = "wander";
}