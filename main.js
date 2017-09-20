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
	botLeft.mousePos = {x:0,y:0};
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
	requiredFiles = ["Actor.js","Button.js","Dragon.js","Bat.js","Knight.js","dragon.png","bat.png","knight.png", "floor.png"];
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
 * clear all canvases to black, preparing them for a fresh render
 */
function clearScreen() {
	topLeftCtx.fillStyle="#000000";
	topLeftCtx.fillRect(0,0,topLeft.width,topLeft.height);
	
	topRightCtx.fillStyle="#000000";
	topRightCtx.fillRect(0,0,topRight.width,topRight.height);
	
	botLeftCtx.fillStyle="#000000";
	botLeftCtx.fillRect(0,0,botLeft.width,botLeft.height);
	
	botRightCtx.fillStyle="#000000";
	botRightCtx.fillRect(0,0,botRight.width,botRight.height);
}

/**
 * scroll the view if the user is pressing an arrow key or WASD
 */
function checkScroll() {
	//scroll right
	if (keyStates[String.fromCharCode(39)] || keyStates["D"]) {
		scrollX += 300*deltaTime;
	}
	
	//scroll left
	if (keyStates[String.fromCharCode(37)] || keyStates["A"]) {
		scrollX -= 300*deltaTime;
	}
	
	//scroll down
	if (keyStates[String.fromCharCode(40)] || keyStates["S"]) {
		scrollY += 300*deltaTime;
	}
	
	//scroll up
	if (keyStates[String.fromCharCode(38)] || keyStates["W"]) {
		scrollY -= 300*deltaTime;
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
 * @param radians: whether the angle is in radians (true) or degrees (false)
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
	var negX = Math.sign(scrollX) == -1;
	var negY = Math.sign(scrollY) == -1;
	//ignore the final canvas, as the UI should not scroll
	for (var j = 0; j < canvases.length-1; ++j) {
		for (var i = -negX; i < (canvases[j].width/200) + 1-negX; ++i) {
			for (var r = -negY; r < (canvases[j].height/200) + 1-negY; ++r) {
				contexts[j].drawImage(images["floor.png"],i*200 - (scrollX % 200),r*200 - (scrollY % 200));
			}
		}
	}
	
	//draw objets
	for (var i = 0; i < objects.length; ++i) {
		drawCentered(objects[i].imageName,objects[i].x - scrollX,objects[i].y - scrollY,objects[i].rot);
	}
	
	//draw a darkened bar to make the GUI more readable
	/*botRightCtx.fillStyle = "rgba(0,0,0,.5)";
	botRightCtx.fillRect(0,0,botRight.width,40);*/
	
	//display each npc's current algorithm
	botRightCtx.font = "30px Arial";
	var textHeight = 30;
	botRightCtx.fillStyle = "#FFFFFF";
	
	for (var i = 0; i < objects.length; ++i) {
		botRightCtx.fillText(objects[i].imageName.split(".")[0] + " algo: " + objects[i].state,5,textHeight * (i+1));	
	}
	
	//display destination of each npc's current algorithm
	for (var i = 0; i < objects.length; ++i) {
		if (objects[i].state == "wander") {
			//wander state: draw wander circle
			topLeftCtx.strokeStyle = objects[i].debugColor;
			topLeftCtx.beginPath();
			topLeftCtx.lineWidth=5;
			topLeftCtx.arc(objects[i].wanderCenter.x - scrollX,objects[i].wanderCenter.y - scrollY,objects[i].wanderRadius,0,2*Math.PI);
			topLeftCtx.stroke();
			topLeftCtx.arc(objects[i].dest.x - scrollX,objects[i].dest.y - scrollY,15,0,2*Math.PI);
			topLeftCtx.closePath();
			
			//draw dest point on wander circle
			topLeftCtx.fillStyle = objects[i].debugColor;
			topLeftCtx.beginPath();
			topLeftCtx.arc(objects[i].dest.x - scrollX,objects[i].dest.y - scrollY,15,0,2*Math.PI);
			topLeftCtx.fill();
			topLeftCtx.closePath();
		}
	}
	
}

/**
 * draw an image centered around the specified coordinates, with an optional arbitrary rotation
 * @param imageName: the name of the image to draw
 * @param x: the center x coordinate at which to draw the image
 * @param y: the center x coordinate at which to draw the image
 * @param rot: if specified, the amount in degrees by which to rotate the image
 */
function drawCentered(imageName,x,y,rot) {
	var img = images[imageName];
	topLeftCtx.save();
	//perform the inverse of the object's translation to effectively bring it to the origin
	topLeftCtx.translate(x,y);
	if (rot != 0) {
		topLeftCtx.rotate(rot*Math.PI/180);
	}
	topLeftCtx.drawImage(img, -(img.width/2), -(img.height/2));
	//restore the canvas now that we're done modifying it
	topLeftCtx.restore();
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
 * sets the fps and begins the main update loop; to be called after resource loading
 */
function startGame() {
	//keep a global fps flag for game-speed (although all speeds should use deltaTime)
	fps = 60;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
	
	//init global game vars
	topLeft = document.getElementById("topLeft");
	topLeftCtx = topLeft.getContext("2d");
	topRight = document.getElementById("topRight");
	topRightCtx = topRight.getContext("2d");
	botLeft = document.getElementById("botLeft");
	botLeftCtx = botLeft.getContext("2d");
	botRight= document.getElementById("botRight");
	botRightCtx = botRight.getContext("2d");
	canvases = [topLeft,topRight,botLeft,botRight];
	contexts = [topLeftCtx,topRightCtx,botLeftCtx,botRightCtx];
	
	scrollX = 0;
	scrollY = 0;
	
	//create game objects
	objects = [];
	objects.push(new Dragon(400,300));
	objects.push(new Bat(500,300));
	objects.push(new Knight(100,300));
	
	//set the game to call the 'update' method on each tick
	_intervalId = setInterval(update, 1000 / fps);
}

setupKeyListeners();
loadAssets();