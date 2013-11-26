	/////////////
	// SIEGE GAME
	/////////////
	
	// current state of the game (are we in menu, are we playing, yada yada)
	var GAMESTATEMENU = 0, GAMESTATELAUNCH = 1, GAMESTATEPLAY = 2;
	var gameState = GAMESTATEMENU;

	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '8px';
	stats.domElement.style.top = '0px';
	
	var renderer, stage; //pixi
	var menu; //game menu
	var world; //the world where everything happens
	var client; //client view for when in play
	var touchDebug; //because no console on tablet so use PIXI text object
	
	//event from asset loading
	loader.onComplete = start; //start() in gamemain.js
	
	function start() {
		
		// create a renderer instance
		renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

		// create an new instance of a pixi stage
		stage = new PIXI.Stage(0x99FFFF, true);

		document.body.appendChild(renderer.view);
		document.body.appendChild( stats.domElement );
		
		renderer.view.style.position = "absolute";
		renderer.view.style.top = "0px";
		renderer.view.style.left = "0px";
		
		//launch menu
		launchMenu();
		
		//////////////////////
		//jquery event handlers
		$(window).resize(resize);
		window.onorientationchange = resize;
		
		resize();
		
		requestAnimFrame(update);
	}
	
	//launch menu
	function launchMenu(){
		menu = new gameMenu();
	}
	
	//launch game
	function launchGame(){
		//the world is the sand box contain of the game
		world = new gameWorld();
		//game client what we see and what we draw
		client = new gameClient();
		
		//touch debug
		touchDebug = new PIXI.Text("", {font:"11px Arial", fill:"white"});
		touchDebug.position.x = 8;
		touchDebug.position.y = 60;
		stage.addChild(touchDebug);
		
		//gamestate
		gameState = GAMESTATEPLAY;
	}
	
	function update()
	{
		
		stats.begin();
		
		//gamestate
		switch(gameState){
		case GAMESTATEMENU:
			//in menu
			break;
		case GAMESTATELAUNCH:
			//launch game
			launchGame();
			break;
		case GAMESTATEPLAY:
			//playing game
			break;
		}
		
		renderer.render(stage);
		
		stats.end();
		
		requestAnimFrame(update);
	}
	
	//window was resized
	function resize(event)
	{	
		//gamestate
		switch(gameState){
		case GAMESTATEMENU:
			menu.resizeMenu();
			break;
		case GAMESTATELAUNCH:
			
			break;
		case GAMESTATEPLAY:
			client.performResizeClientView();
			break;
		}
		
		renderer.resize(window.innerWidth, window.innerHeight);
	}
	