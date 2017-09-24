/**
 * create a list of keystates, maintained by event listeners
 */
function setupKeyListeners() {
	keyStates = [];
	//add keydown and keyup events for all keys
	document.body.addEventListener("keydown", function (e) {
		keyStates[String.fromCharCode(e.keyCode)] = true;
	});
	document.body.addEventListener("keyup", function (e) {
		keyStates[String.fromCharCode(e.keyCode)] = false;
	});
	
	//mouse event listeners (down is triggered every frame, pressed is only triggered on the first frame)
	mouseDownLeft = false;
	mousePressedLeft = false;
	mouseDownRight = false;
	mousePressedRight = false;
	topLeft.mousePos = {x:0,y:0};
	topRight.mousePos = {x:0,y:0};
	botRight.mousePos = {x:0,y:0};
	
	document.body.addEventListener("mousemove", function (e) {
		//store the relative mouse position for each canvas
		for (var i = 0; i < canvases.length; ++i) {
			canvases[i].mousePos = getMouseDocument(e,canvases[i]);
		}
	});
	document.body.addEventListener("mousedown", function (e) {
		if (e.button == 0) {
			//left click press detected
			mouseDownLeft = true;
			mousePressedLeft = true;
		}
		else if (e.button == 2) {
			//right click press detected
			mouseDownRight = true;
			mousePressedRight = true;
		}
	});
	document.body.addEventListener("mouseup", function (e) {
		if (e.button == 0) {
			//left click release detected
			mouseDownLeft = false;
		}
		else if (e.button == 2) {
			//right click release detected
			mouseDownRight = false;
		}
	});
}

/**
 * get the position of the mouse in the document
 * @param evt: the currently processing event
 * @param cnv: the canvas to check mouse position against
 * @returns an object containing the x,y coordinates of the mouse
 */
function getMouseDocument(evt,cnv) {
	 var rect = cnv.getBoundingClientRect();
	 return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};	
}

/**
 * loads all the needed files, then calls startGame to begin the game
 */
function loadAssets() {	
	//global list of assets and current asset number
	requiredFiles = ["Actor.js","Button.js","Dragon.js","Bat.js","Knight.js", "Arrow.js","Path.js",
		"dragon.png","bat.png","knight.png", "arrow.png","tileGrayscale.png","gold.png"];
	
	assetNum = 0;
	
	//global list of script contents
	scripts = {}
	//global list of images
	images = {}
	
	//quick and dirty way to store local text files as JS objects
	object = null;
	
	loadAsset();
}

/**
 * load a single asset, setting onload to move on to the next asset
 */
function loadAsset() {
	//if the global object var contains a string, append it to the global scripts list
	if (object != null) {
		scripts[requiredFiles[assetNum-1]] = object;
		object = null;
	}
	//once we've loaded all the objects, we are ready to start the game
	if (assetNum >= requiredFiles.length) {
		return startGame();
	}
	
	//get the element type from its file extension
	var splitName = requiredFiles[assetNum].split(".");
	var extension = splitName[splitName.length-1];
	var elemType = (extension == "js" ? "script" : "IMG")
	
	//create the new element
	var elem = document.createElement(elemType);
	elem.onload = loadAsset;
	elem.src = requiredFiles[assetNum];
	
	//add the new element to the body if its a script
	if (elemType == "script") {
		document.body.appendChild(elem);
	}
	//add the new element to the image dict if its an image
	else if (elemType == "IMG") {
		images[requiredFiles[assetNum]] = elem;
	}
	
	++assetNum;
}

/**
 * make the input object a child of the specified parent object
 * @param objectName: the name of the child object being given inheritance
 * @param parentName: the name of the parent object
 */
function makeChild(objectName, parentName) {
	eval(objectName + ".prototype = Object.create(" + parentName + ".prototype);" + 
			objectName + ".prototype.constructor = " + objectName + ";");
}

/**
 * clear all canvases to their respective fill colors, preparing them for a fresh render
 */
function clearScreen() {
	topLeftCtx.fillStyle="rgb(40,120,255)";
	topLeftCtx.fillRect(0,0,topLeft.width,topLeft.height);
	
	topRightCtx.fillStyle="rgb(140,20,255)";
	topRightCtx.fillRect(0,0,topRight.width,topRight.height);
	
	botRightCtx.fillStyle="rgb(35,150,35)";
	botRightCtx.fillRect(0,0,botRight.width,botRight.height);
}

/**
 * scroll the view if any character has approached the edge of the screen
 */
function checkScroll() {
	for (var i = 0; i < objects.length; ++i) {
		var obj = objects[i];
		var cnv = obj.canvas;
		var realX = obj.x - cnv.scrollX;
		var realY = obj.y - cnv.scrollY;
		//scroll to keep objects within a certain percentage of their canvas
		var cameraBounds = .55;
		if (realX > cameraBounds*cnv.width) {
			cnv.scrollX -= cameraBounds*cnv.width - realX;
		}
		else if (realX < (1-cameraBounds)*cnv.width) {
			cnv.scrollX -= (1-cameraBounds)*cnv.width - realX;
		}
		
		if (realY > cameraBounds*cnv.height) {
			cnv.scrollY += realY - cameraBounds*cnv.height;
		}
		else if (realY < (1-cameraBounds)*cnv.height) {
			cnv.scrollY += realY - (1-cameraBounds)*cnv.height;
		}
	}
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	//if the user is pressing the arrow keys or WASD, scroll the view
	checkScroll();
	
	//update objects
	for (var i = 0; i < objects.length; ++i) {
		objects[i].update();
	}
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}

/**
 * get the angle between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @param radians: whether the returned angle should be in radians (true) or degrees (false)
 * @returns the angle between the two input points
 */
function getAngle(x1,y1,x2,y2,radians) {
	if (radians == null || radians == false) {
		return Math.atan2((y2-y1),(x2-x1))*180/Math.PI;
	}
	return Math.atan2((y2-y1),(x2-x1));
}

/**
 * get a random integer between min (inclusive) and max (exclusive)
 * @param min: the inclusive minimum integer value
 * @param max: the exclusive maximum integer value
 * @returns the randomly generated integer between min and max
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * render all objects and HUD elements
 */
function render() {
	//clear all canvases for a fresh render
	clearScreen();
	
	//draw background tiles covering the entire screen (1 tile buffer to make scrolling seamless)
	//ignore the final canvas, as the UI should not scroll
	for (var j = 0; j < canvases.length; ++j) {
		var scrollX = canvases[j].scrollX;
		var scrollY = canvases[j].scrollY;
		var negX = Math.sign(scrollX) == -1;
		var negY = Math.sign(scrollY) == -1;
		for (var i = -negX; i < (canvases[j].width/200) + 1-negX; ++i) {
			for (var r = -negY; r < (canvases[j].height/200) + 1-negY; ++r) {
				contexts[j].drawImage(images["tileGrayscale.png"],i*200 - (scrollX % 200),r*200 - (scrollY % 200));
			}
		}
	}
	
	//display info about each npc's current algorithm
	for (var i = 0; i < objects.length; ++i) {
		var ctx = objects[i].canvas.getContext("2d");
		var scrollX = objects[i].canvas.scrollX;
		var scrollY = objects[i].canvas.scrollY;
		ctx.lineWidth=5;
		//object is wandering: display wander radius and destination point
		if (objects[i].state == "wander") {
			//wander state: draw wander circle
			ctx.strokeStyle = objects[i].debugColor;
			ctx.beginPath();
			ctx.arc(objects[i].wanderCenter.x - scrollX,
					objects[i].wanderCenter.y - scrollY,objects[i].wanderRadius,0,2*Math.PI);
			ctx.stroke();
			ctx.arc(objects[i].dest.x - scrollX,
					objects[i].dest.y - scrollY,15,0,2*Math.PI);
			ctx.closePath();
			
			//draw dest point on wander circle
			ctx.fillStyle = objects[i].debugColor;
			ctx.beginPath();
			ctx.arc(objects[i].dest.x - scrollX,
					objects[i].dest.y - scrollY,15,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
		
		//object is following a path: display connected series of path points
		else if (objects[i].state == "follow path") {
			var points = objects[i].path.points;
			//draw lines connecting the path
			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(points[0][0]-scrollX,points[0][1]-scrollY);
			for (var r = 1; r < points.length; ++r) {
				ctx.lineTo(points[r][0]-scrollX,points[r][1]-scrollY);
				ctx.stroke();
			}
			if (objects[i].path.loop) {
				ctx.lineTo(points[0][0]-scrollX,points[0][1]-scrollY);
				ctx.stroke();
			}
			ctx.closePath();
			
			//draw the points on the path
			ctx.fillStyle = "#FF0000";
			for (var r = 0; r < points.length; ++r) {
				ctx.beginPath();
				ctx.arc(points[r][0]-scrollX,points[r][1]-scrollY,8,0,2*Math.PI);
				ctx.fill();
				ctx.closePath();
			}
			
			//draw the 'slow radius' around each point
			ctx.strokeStyle = objects[i].debugColor;
			for (var r = 0; r < points.length; ++r) {
				ctx.beginPath();
				ctx.arc(points[r][0]-scrollX,points[r][1]-scrollY,objects[i].slowRadius,0,2*Math.PI);
				ctx.stroke();
				ctx.closePath();
			}
		}
		
		else if (objects[i].state == "pursue" || objects[i].state == "evade"){
			//draw a slow radius surrounding the object's home
			ctx.strokeStyle = objects[i].debugColor;
			ctx.beginPath();
			ctx.arc(objects[i].home.x-scrollX,
					objects[i].home.y-scrollY,objects[i].slowRadius,0,2*Math.PI);
			ctx.stroke();
			ctx.closePath();
		}
	}
	
	//draw objects in front of their algorithm GUI components
	for (var i = 0; i < objects.length; ++i) {
		drawCentered(objects[i].imageName,objects[i].canvas.getContext("2d"),
				objects[i].x - objects[i].canvas.scrollX,objects[i].y - objects[i].canvas.scrollY,objects[i].dir);
	}
	
	//draw a darkened bar at the top of each canvas to make the GUI more readable
	for (var i = 0; i < canvases.length; ++i) {
		contexts[i].fillStyle = "rgba(0,0,0,.5)";
		//draw a double height bar for the first canvas, as it must display two objects' algorithms at once
		contexts[i].fillRect(0,0,canvases[i].width,i == 0 ? 80 : 40);
		contexts[i].font = "30px Arial";
		contexts[i].fillStyle = "#FFFFFF";
	}
	
	//display each npc's current algorithm
	var textHeight = 30;	
	for (var i = 0; i < objects.length; ++i) {
		var state = objects[i].state;
		//no need to display an algorithm for static objects
		if (state == "static") {
			continue;
		}
		//in the case of pursue, evade, and follow path algorithms, check if we are perforrming a dynamic arrive
		if ((objects[i].state == "pursue" || objects[i].state == "evade") && objects[i].alerted == false) {
			state = (objects[i].inSlowRadius() ? "dynamic arrive" : "approaching gold");
		}
		else if (objects[i].state == "follow path") {
			state = (objects[i].inSlowRadius() ? "dynamic arrive" : "follow path");
		}
		//finally, display the determined algorithm for this object
		objects[i].canvas.getContext("2d").fillText(
				objects[i].imageName.split(".")[0] + " algorithm: " + state,5,30*(i==2?2:1));
	}
}

/**
 * draw an image centered around the specified coordinates, with an optional arbitrary rotation
 * @param imageName: the name of the image to draw
 * @param ctx: the context onto which to draw the image
 * @param x: the center x coordinate at which to draw the image
 * @param y: the center x coordinate at which to draw the image
 * @param rot: if specified, the amount in degrees by which to rotate the image
 */
function drawCentered(imageName,ctx,x,y,rot) {
	var img = images[imageName];
	ctx.save();
	//perform the inverse of the object's translation to effectively bring it to the origin
	ctx.translate(x,y);
	if (rot != 0) {
		ctx.rotate(rot*Math.PI/180);
	}
	ctx.drawImage(img, -(img.width/2), -(img.height/2));
	//restore the canvas now that we're done modifying it
	ctx.restore();
}

/**
 * get the distance between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @returns the distance between the two input points
 */
function getDistance(x1,y1,x2,y2) {
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}

/**
 * update the global deltaTime
 */
function updateTime() {
	var curTime = Date.now();
	//divide by 1,000 to get deltaTime in seconds
    deltaTime = (curTime - prevTime) / 1000;
    //cap deltaTime at ~15 ticks/sec as below this threshhold collisions may not be properly detected
    if (deltaTime > .067) {
    	deltaTime = .067;
    }
    prevTime = curTime;
    totalTime += deltaTime;
}

/**
 * calls initGlobals and begins the main update loop; to be called after resource loading
 */
function startGame() {
	initGlobals();

	//set the game to call the 'update' method on each tick
	_intervalId = setInterval(update, 1000 / fps);
}

/**
 * initialize references to all of our canvases, and set their starting scroll values to 0
 */
function initCanvases() {
	//created appropriately named references to all of our canvases
	topLeft = document.getElementById("topLeft");
	topLeftCtx = topLeft.getContext("2d");
	topRight = document.getElementById("topRight");
	topRightCtx = topRight.getContext("2d");
	botRight = document.getElementById("botRight");
	botRightCtx = botRight.getContext("2d");
	canvases = [topLeft,topRight,botRight];
	contexts = [topLeftCtx,topRightCtx,botRightCtx];
	
	//reset camera position for all canvases
	for (var i = 0; i < canvases.length; ++i) {
		canvases[i].scrollX = 0;
		canvases[i].scrollY = 0;
	}
}

/**
 * initialize all global variables
 */
function initGlobals() {
	//keep a global fps flag for game-speed (although all speeds should use deltaTime)
	fps = 60;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
		
	//create global game objects
	objects = [];
	//create the gold pile first as it is rendered in back
	objects.push(new Actor(600,100,"gold.png",topLeft));
	objects[0].state = "static";
	
	//create the bat and dragon
	objects.push(new Dragon(400,300,topLeft));
	objects.push(new Knight(700,300,topLeft));
	//once the knight and dragon have been created, set them to be each others' targets
	objects[1].target = objects[2];
	objects[2].target = objects[1];
	objects[1].home = objects[0];
	objects[2].home = objects[0];
	objects.push(new Bat(100,300,topRight));
	objects.push(new Arrow(200,200,botRight));
}

initCanvases();
setupKeyListeners();
loadAssets();