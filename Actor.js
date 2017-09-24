/**
 * update the actor
 */
Actor.prototype.update = function() {
	//run the named method corresponding to our current state
	eval("this.state == 'static' ? '': this." + this.stateMethods[this.state] + "();");
	this.approachWantDir();
}

/**
 * update the desired direction, while bounding it between 0 and 360 degrees
 */
Actor.prototype.updateWantDir = function(newDir) {
	this.wantDir = newDir%360;
	if (this.wantDir < 0) {
		this.wantDir += 360;
	}
}

/**
 * update dir towards wantDir at a rate of angSpeed
 */
Actor.prototype.approachWantDir = function() {
	if (this.wantDir != this.dir) {
		//first, determine whether it is faster to turn clockwise, or counter-clockwise
		var rotDir = (((this.wantDir - this.dir) + 360) % 360) > 180.0 ? -1 : 1;
		
		//now rotate in the desired direction, making sure not to rotate past the desired direction
		var rotChange = rotDir * this.angSpeed * deltaTime;
		if (Math.abs(this.wantDir - this.dir) <= Math.abs(rotChange)) {
			this.dir = this.wantDir;
		}
		else {
			//update direction, and keep it bounded between 0 and 360
			this.dir = (this.dir + rotChange) % 360;
			if (this.dir < 0) {
				this.dir += 360;
			}
		}
	}
}

/**
 * approach a target point, stopping there if we will reach or move past it
 * @param destX: the x coordinate to move towards
 * @param destY: the y coordinate to move towards
 * @param amt: the amount by which to move
 * @param absolute: whether to ignore deltaTime (true) or not (false)
 * @returns whether we reached the destination (true) or not (false)
 */
Actor.prototype.approachDestination = function(destX, destY,amt,absolute) {
	var remDist = getDistance(this.x,this.y,destX,destY);
	if (remDist >this.fullSpeed * deltaTime) {
		//we cannot reach our destination yet, so simply move towards the destination
		this.updateWantDir(getAngle(this.x,this.y,destX,destY));
		this.moveForward(amt,absolute);
		return false;
	}
	else {
		//we will reach our destination, so stop there rather than going past it
		this.x = destX;
		this.y = destY;
		return true;
	}
}


/**
 * run away from the target Actor
 */
Actor.prototype.evade = function() {
	if (!this.alerted) {
		//we are not alerted; check if we should become alerted, and if not, move towards home
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.alertEvadeDistance) {
			//we are within range of the target; switch to alerted and restart evade
			this.alerted = true;
			return this.evade();
		}
		//we are not within range, so move towards home
		this.approachDestination(this.home.x,this.home.y,this.inSlowRadius() ? this.slowSpeed : this.fullSpeed);
	}
	else {
		//we are alerted; check if we should stop being alerted, and if not, continue evading the target
		if (getDistance(this.x,this.y,this.target.x,this.target.y) >= this.maxEvadeDistance) {
			//we are not in range of the target anymore; switch off alerted and restart evade
			this.alerted = false;
			return this.evade();
		}	
		//we are still in range of the target; continue evading
		this.updateWantDir(180 + getAngle(this.x,this.y,this.target.x,this.target.y));
		this.moveForward(this.fullSpeed);
	}
}

/**
 * pursue the target Actor
 */
Actor.prototype.pursue = function() {
	if (!this.alerted) {
		//we are not alerted; check if we should become alerted, and if not, move towards home
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.alertPursueDistance) {
			//we are within range of the target; switch to alerted and restart pursue
			this.alerted = true;
			return this.pursue();
		}
		//we are not within range, so move towards home
		this.approachDestination(this.home.x,this.home.y,this.inSlowRadius() ? this.slowSpeed : this.fullSpeed);
	}
	else {
		//we are alerted; check if we should stop being alerted, and if not, continue pursuing the target
		if (getDistance(this.x,this.y,this.target.x,this.target.y) >= this.maxPursueDistance) {
			//we are not in range of the target anymore; switch off alerted and restart pursue
			this.alerted = false;
			return this.pursue();
		}	
		//we are still in range of the target; continue pursuing
		this.updateWantDir(getAngle(this.x,this.y,this.target.x,this.target.y));
		this.moveForward(this.fullSpeed);
	}
}

/**
 * find the closest point on this actor's path
 * @returns the index of the closest point on our path
 */
Actor.prototype.findClosestPoint = function() {
	var closestInd = -1;
	var closestDist = -1;
	for (var i = 0; i < this.path.points.length; ++i) {
		var ptDist = getDistance(this.x,this.y,this.path.points[i][0],this.path.points[i][1]);
		//check if this new point is closer to our starting position than the current closest point
		if (ptDist < closestDist || closestInd == -1) {
			closestInd = i;
			closestDist = ptDist;
		}
	}
	return closestInd;
}

/**
 * predict the expected location of the target to cut them off
 */
Actor.prototype.getExpectedTargetLocation = function() {
	//don't do anything if we aren't currently in a pursuit
	if (!this.alerted) {
		return;
	}
	//this.target.location * this.target.speed * (distance*time)
}

/**
 * check if this actor is currently in one of its slow radii
 * @returns whether this actor is in a slow radius (true) or not (false)
 */
Actor.prototype.inSlowRadius = function() {
	if (this.state  == "follow path") {
		return (getDistance(this.x,this.y,this.path.points[this.nextPoint][0],
				this.path.points[this.nextPoint][1]) <= this.slowRadius);
	}
	if (this.state  == "pursue" || this.state == "evade") {
		return (getDistance(this.x,this.y,this.home.x,this.home.y) <= this.slowRadius);
	}
	return false;
}

/**
 * move towards the next point on this Actor's path
 */
Actor.prototype.followPath = function() {
	//if we just started following this path, hop onto the closest point
	if (this.nextPoint == null) {
		this.prevPoint = this.nextPoint = this.findClosestPoint();
	}
	var moveRemaining = (this.inSlowRadius() ? this.slowSpeed : this.fullSpeed) * deltaTime;
	while (moveRemaining > 0) {
		var destX = this.path.points[this.nextPoint][0];
		var destY = this.path.points[this.nextPoint][1];
		this.updateWantDir(getAngle(this.x,this.y,destX,destY));
		
		//if moving forward will bring us past the point, move to it, update direction, and move the remaining distance
		var remDist = getDistance(this.x,this.y,destX,destY);
		if (this.approachDestination(destX,destY,moveRemaining,true)) {
			//we reached the point; subtract the distance we traveled from our total movement and choose the next point
			moveRemaining -= remDist;
			this.prevPoint = this.nextPoint;
			this.nextPoint = (this.nextPoint + 1) % this.path.points.length;
		}
		else {
			moveRemaining = 0;
		}
	}
}

/**
 * wander to a random point on a circle around this Actor, then choose a new point
 */
Actor.prototype.wander = function() {
	//decrement wander timer, choosing a new point on the circle if it runs out
	this.wanderTimer -= deltaTime;
	if (this.wanderTimer <= 0 || this.dest == null) {
		//choose a new point around us by generating the x between 0 and rad, then solving for y
		var xLen = getRandomInt(0,this.wanderRadius);
		var yLen = Math.sqrt(this.wanderRadius*this.wanderRadius - xLen*xLen);
		var xSign = getRandomInt(0,2) == 1 ? -1 : 1;
		var ySign = getRandomInt(0,2) == 1 ? -1 : 1;
		
		//move forward by a fixed amount so we can place the circle around this new location
		var curX = this.x;
		var curY = this.y;
		this.moveForward(this.wanderDistance,true);
		
		this.dest = {x: this.x + xLen*xSign, y: this.y + yLen*ySign};
		this.wanderCenter = {x:this.x,y:this.y};
		
		//move back now that we've set the circle location
		this.x = curX;
		this.y = curY;
		
		//start timer to determine when to stop wandering
		this.wanderTimer += this.wanderMaxTimer;
	}
	this.updateWantDir(getAngle(this.x,this.y,this.dest.x,this.dest.y));
	this.moveForward(this.fullSpeed);
}

/**
 * move the actor forward by the specified amount, shifted by deltaTime
 * @param amt: the amount by which to move the actor
 * @param isAbsolute: whether the amount to move is absolute (true) or relative to deltaTime (false).
 * if unspecified, isAbsolute defaults to false.
 */
Actor.prototype.moveForward = function(amt,isAbsolute) {
	if (isAbsolute == null) {
		isAbsolute = false;
	}
	this.x += Math.cos(this.dir * Math.PI/180) * amt * (isAbsolute ? 1 : deltaTime);
	this.y += Math.sin(this.dir * Math.PI/180) * amt * (isAbsolute ? 1 : deltaTime);
}

/**
 * base actor class from which game-objects will extend
 * @param x: the starting center x coordinate of the actor
 * @param y: the starting center y coordinate of the actor
 * @param imageName: the image name which represents this Actor
 * @param cnv: the canvas to which this actor belongs
 * @param rot: the starting rotation (in degrees) of the actor
 * @param slowSpeed: the rate at which an actor moves while within the slow radius
 * @param fullSpeed: the rate at which an actor moves while outside of the slow radius
 * @param angSpeed: the rate at which an actor turns
 */
function Actor(x,y,imageName,cnv,rot,slowSpeed, fullSpeed, angSpeed) {
	//set some reasonable default values for the optional args
	if (rot == null) {
		rot = 0;
	}
	if (slowSpeed == null) {
		slowSpeed = 50;
	}
	if (fullSpeed == null) {
		fullSpeed = 100;
	}
	if (angSpeed == null) {
		angSpeed = 360;
	}
	
	//initialize all of our properties
	this.x = x;
	this.y = y;
	this.imageName = imageName;
	this.canvas = cnv;
	
	//movement vars
	this.fullSpeed = fullSpeed;
	this.slowSpeed = slowSpeed;
	this.slowRadius = 0;
	
	//angular vars
	this.dir = rot;
	this.wantDir = rot;
	this.angSpeed = angSpeed;
		
	//state related vars
	this.state = "static";
	
	//wander vars
	this.wanderRadius = 40;
	this.wanderDistance = 125;
	this.wanderTimer = 0;
	this.wanderMaxTimer = .6;
	this.wanderCenter = null;
	this.dest = null;
	
	//pursue/evade vars
	this.maxPursueDistance = 170;
	this.alertPursueDistance = 120;
	
	this.alertEvadeDistance = 100;
	this.maxEvadeDistance = 230;
	
	this.alerted = false;
	this.target = null;
	this.home = null;
	
	//keep a list of our update methods based on current state, to simplify update logic
	this.stateMethods = {"wander":"wander", "pursue": "pursue",	"evade":"evade","follow path":"followPath"};
}