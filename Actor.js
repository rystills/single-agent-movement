/**
 * update the actor
 */
Actor.prototype.update = function() {
	//update the current state
	if (this.state == "wander") {
		this.wander();
	}
}

/**
 * wander to a random point on a circle around this Actor, then choose a new point
 */
Actor.prototype.wander = function() {
	if (this.dest == null) {
		//choose a new point around us by generating the x between -rad and rad, then solving for y
		var xLen = getRandomInt(0,this.wanderRadius);
		var yLen = Math.sqrt(this.wanderRadius*this.wanderRadius - xLen*xLen);
		var xSign = getRandomInt(0,2) == 1 ? -1 : 1;
		var ySign = getRandomInt(0,2) == 1 ? -1 : 1;
		this.dest = {x: this.x + xLen*xSign, y: this.y + yLen*ySign};
		this.wanderCenter = {x:this.x,y:this.y};
	}
	this.rot = getAngle(this.x,this.y,this.dest.x,this.dest.y);
}

/**
 * spin the actor by the specified amount, shifted by deltaTime
 * @param amt: the amount by which to spin the actor
 */
Actor.prototype.spin = function(amt) {
	this.rot = (this.rot + amt * deltaTime) % 360;
}

/**
 * move the actor forward by the specified amount, shifted by deltaTime
 * @param amt: the amount by which to move the actor
 */
Actor.prototype.moveForward = function(amt) {
	this.x += Math.cos(this.rot * Math.PI/180) * amt * deltaTime;
	this.y += Math.sin(this.rot * Math.PI/180) * amt * deltaTime;
}

/**
 * base actor class from which game-objects will extend
 * @param x: the starting center x coordinate of the actor
 * @param y: the starting center y coordinate of the actor
 * @param rot: the starting rotation (in degrees) of the actor
 * @param accel: the rate of acceleration/deceleration of the actor
 * @param maxVel: the maximum velocity of the actor
 * @param angAccel: the rate of angular acceleration/deceleration of the actor
 * @param angMaxVel: the maximum angular velocity of the actor
 */
function Actor(x,y,rot,accel, maxVel, angAccel, angMaxVel) {
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
	this.rot = rot;
	this.accel = accel;
	this.maxVel = maxVel;
	this.angAccel = angAccel;
	this.angMaxVel = angMaxVel;
	this.vel = 0;
	this.angVel = 0;
	
	//state related vars
	this.state = "wander";
	this.wanderRadius = 150;
	this.dest = null;
	this.wanderCenter = null;
}