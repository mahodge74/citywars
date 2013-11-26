function gameMenu(){
	//world container. enables changing our camera view by moving the container
	var menuContainer = new PIXI.DisplayObjectContainer();
	menuContainer.position = new PIXI.Point(0, 0);
	stage.addChild(menuContainer);
	

	var title = new PIXI.Text("SIEGE GAME ALPHA", {font:"20px Arial", fill:"red"});
	menuContainer.addChild(title);
	var buttonStart = new PIXI.Text("Start Siege", {font:"20px Arial", fill:"red"});
	menuContainer.addChild(buttonStart);
	buttonStart.setInteractive(true);
	
	refreshMenu();
	
	function refreshMenu(){
		title.position.x = (window.innerWidth / 2) - (title.width / 2);
		title.position.y = 16;
		
		buttonStart.position.x = (window.innerWidth / 2) - (buttonStart.width / 2);
		buttonStart.position.y = title.position.y + title.height + 16;
		
		///////////////////////////////////////////////////
		//just to start the game quick in development stage
		buttonStartClick(); ///////////////////////////////
	}	
	
	// events
	buttonStart.click = buttonStartClick;
	buttonStart.tap = buttonStartClick;
	function buttonStartClick(){
		buttonStart.setText("Game Launching");
		menuContainer.visible = false;
		gameState = GAMESTATELAUNCH;
	};
	
	this.resizeMenu = function(){
		refreshMenu();
	};
}