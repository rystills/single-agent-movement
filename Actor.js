/**
 * update the actor
 */
Actor.prototype.update = function() {
	//placeholder update: passivel spin at a rate of angAccel while moving forward
	this.spin(this.angAccel);
	this.moveForward(this.accel);
}

/**
 * spin the actor by the specified amount, shifted by deltaTime
 * @param amt: the amount by which to spin the actor
 */
Actor.prototype.spin = function(amt) {
	console.log(amt)
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
	this.state = "wander";
	this.x = x;
	this.y = y;
	this.rot = rot;
	this.accel = accel;
	this.maxVel = maxVel;
	this.angAccel = angAccel;
	this.angMaxVel = angMaxVel;
	this.vel = 0;
	this.angVel = 0;
}