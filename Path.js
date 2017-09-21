/**
 * simple container object used to store a list of points
 * @param pointList: list of [x,y] points to store
 * @param loop: whether the path should loop on completion (true) or end at the last point (false)
 */
function Path(pointList,loop) {
	this.points = pointList;
	this.loop = (loop == null ? false : loop);
}