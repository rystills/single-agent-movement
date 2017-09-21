/**
 * update the actor
 */
Actor.prototype.update = function() {
	//update the current state
	if (this.state == "wander") {
		this.wander();
	}
	else if (this.state == "evade") {
		this.evade();
	}
	else if (this.state == "pursue") {
		this.pursue();
	}
	else if (this.state == "follow path") {
		this.followPath();
	}
}


/**
 * run away from the target Actor
 */
Actor.prototype.evade = function() {
	if (!this.alerted) {
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.alertEvadeDistance) {
			this.alerted = true;
		}
		else {
			var remDist = getDistance(this.x,this.y,this.home.x,this.home.y);
			if (remDist > this.accel*100 * deltaTime) {
				this.rot = getAngle(this.x,this.y,this.home.x,this.home.y);
				this.moveForward(this.accel*100);	
			}
			else {
				this.x = this.home.x;
				this.y = this.home.y;
			}
		}
	}
	if (this.alerted) {
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.maxEvadeDistance) {
			this.rot = 180 + getAngle(this.x,this.y,this.target.x,this.target.y);
			this.moveForward(this.accel*140);	
		}
		else {
			this.alerted = false;
			var remDist = getDistance(this.x,this.y,this.home.x,this.home.y);
			if (remDist > this.accel*100 * deltaTime) {
				this.rot = getAngle(this.x,this.y,this.home.x,this.home.y);
				this.moveForward(this.accel*100);	
			}
			else {
				this.x = this.home.x;
				this.y = this.home.y;
			}
		}	
	}
}

/**
 * pursue the target Actor
 */
Actor.prototype.pursue = function() {
	if (!this.alerted) {
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.alertPursueDistance) {
			this.alerted = true;
		}
		else {
			var remDist = getDistance(this.x,this.y,this.home.x,this.home.y);
			if (remDist > this.accel*90 * deltaTime) {
				this.rot = getAngle(this.x,this.y,this.home.x,this.home.y);
				this.moveForward(this.accel*90);	
			}
			else {
				this.x = this.home.x;
				this.y = this.home.y;
			}	
		}
	}
	if (this.alerted) {
		if (getDistance(this.x,this.y,this.target.x,this.target.y) < this.maxPursueDistance) {
			this.rot = getAngle(this.x,this.y,this.target.x,this.target.y);
			this.moveForward(this.accel*115);	
		}
		else {
			this.alerted = false;
			var remDist = getDistance(this.x,this.y,this.home.x,this.home.y);
			if (remDist > this.accel*90 * deltaTime) {
				this.rot = getAngle(this.x,this.y,this.home.x,this.home.y);
				this.moveForward(this.accel*90);	
			}
			else {
				this.x = this.home.x;
				this.y = this.home.y;
			}
		}	
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
 * move towards the next point on this Actor's path
 */
Actor.prototype.followPath = function() {
	//if we just started following this path, hop onto the closest point
	if (this.nextPoint == null) {
		this.nextPoint = this.findClosestPoint();
	}
	var moveRemaining = this.accel*200 * deltaTime;
	while (moveRemaining > 0) {
		var destX = this.path.points[this.nextPoint][0];
		var destY = this.path.points[this.nextPoint][1];
		this.rot = getAngle(this.x,this.y,destX,destY);
		
		//if moving forward will bring us past the point, move to it, update direction, and move the remaining distance
		var remDist = getDistance(this.x,this.y,destX,destY);
		var maxDist = moveRemaining;
		
		if (remDist > maxDist) {
			//moving forward will not put us at or past the point
			this.moveForward(moveRemaining,true);	
			moveRemaining = 0;
		}
		else {
			//moving forward will get us to the point
			this.x = destX;
			this.y = destY;
			moveRemaining -= remDist;
			this.nextPoint = (this.nextPoint + 1) % this.path.points.length;
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
		//choose a new point around us by generating the x between -rad and rad, then solving for y
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
		this.wanderTimer += .6;
	}
	this.rot = getAngle(this.x,this.y,this.dest.x,this.dest.y);
	this.moveForward(this.accel*100);
}

/**
 * spin the actor by the specified amount, shifted by deltaTime
 * @param amt: the amount by which to spin the actor
 * @param isAbsolute: whether the amount to rotate is absolute (true) or relative to deltaTime (false).
 * if unspecified, isAbsolute defaults to false.
 */
Actor.prototype.spin = function(amt,isAbsolute) {
	if (isAbsolute == null) {
		isAbsolute = false;
	}
	this.rot = (this.rot + amt * (isAbsolute ? 1 : deltaTime)) % 360;
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
	this.x += Math.cos(this.rot * Math.PI/180) * amt * (isAbsolute ? 1 : deltaTime);
	this.y += Math.sin(this.rot * Math.PI/180) * amt * (isAbsolute ? 1 : deltaTime);
}

/**
 * base actor class from which game-objects will extend
 * @param x: the starting center x coordinate of the actor
 * @param y: the starting center y coordinate of the actor
 * @param imageName: the image name which represents this Actor
 * @param cnv: the canvas to which this actor belongs
 * @param rot: the starting rotation (in degrees) of the actor
 * @param accel: the rate of acceleration/deceleration of the actor
 * @param maxVel: the maximum velocity of the actor
 * @param angAccel: the rate of angular acceleration/deceleration of the actor
 * @param angMaxVel: the maximum angular velocity of the actor
 */
function Actor(x,y,imageName,cnv,rot,accel, maxVel, angAccel, angMaxVel) {
	//set some reasonable default values for the optional args
	if (rot == null) {
		rot = 0;
	}
	if (accel == null) {
		accel = 1;
	}
	if (maxVel == null) {
		maxVel = 10;
	}
	if (angAccel == null) {
		angAccel = 10;
	}
	if (angMaxVel == null) {
		angMaxVel = 100;
	}
	
	//initialize all of our properties
	this.x = x;
	this.y = y;
	this.imageName = imageName;
	this.canvas = cnv;
	this.rot = rot;
	this.accel = accel;
	this.maxVel = maxVel;
	this.angAccel = angAccel;
	this.angMaxVel = angMaxVel;
	this.vel = 0;
	this.angVel = 0;
	
	//state related vars
	this.state = "wander";
	this.wanderRadius = 40;
	this.wanderDistance = 125;
	this.dest = null;
	this.wanderTimer = 0;
	this.wanderCenter = null;
	this.maxPursueDistance = 150;
	this.alertPursueDistance = 100;
	this.alertEvadeDistance = 80;
	this.maxEvadeDistance = 260;
	this.alerted = false;
	this.target = null;
	this.home = null;
}