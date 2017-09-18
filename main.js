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
	canvas.mousePos = {x:0,y:0};
	
	document.body.addEventListener("mousemove", function (e) {
		//store the relative mouse position for each canvas
		canvas.mousePos = getMouseDocument(e,canvas);
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
	//global list of script assets and current script number
	scriptFiles = ["Button.js"];
	scriptNum = 0;
	
	//global list of script contents
	scripts = {}
	
	//quick and dirty way to store local text files as JS objects
	object = null;
	
	loadAsset(scriptFiles,0);
}

/**
 * load a single asset, setting onload to move on to the next asset
 */
function loadAsset() {
	//if the global object var contains a string, append it to the global scripts list
	if (object != null) {
		scripts[scriptFiles[scriptNum-1]] = object;
		object = null;
	}
	//once we've loaded all the objects, we are ready to start the game
	if (scriptNum >= scriptFiles.length) {
		return startGame();
	}
	
	//load the desired script file
	var elem = document.createElement('script');
	elem.type = 'text/javascript';
	elem.onload = loadAsset;
	elem.src = scriptFiles[scriptNum];
	
	//add the new script to the body and increment the script count
	document.body.appendChild(elem);
	++scriptNum;
}

/**
 * clear the entire screen to black, preparing it for a fresh render
 */
function clearScreen() {
	context.fillStyle="#000000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}

/**
 * render all objects and HUD elements
 */
function render() {
	//clear all canvases for a fresh render
	clearScreen();
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
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	//set the game to call the 'update' method on each tick
	_intervalId = setInterval(update, 1000 / fps);
}

setupKeyListeners();
loadAssets();