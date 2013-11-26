function gameClient(){
	
	//player name connected with this client
	//var playerName = "Joe Bloggs";
	var playerIndex = world.getAmountOfPlayers() - 1;
	
	//fake camera view
	var camera = new function(){
		this.viewWidth = window.innerWidth;
		this.viewHeight = window.innerHeight;
		this.viewPosition = new PIXI.Point(0, 0);
		this.viewPosRight;
		this.viewPosBottom;
	};
	
	var inputJustDown = false, areWeDragging = false, didWeJustDrag = false;
	var worldGrabStartX = 0, worldGrabStartY = 0;//did we move enough to start dragging
	var worldOldX = 0, worldOldY = 0, worldNewX = 0, worldNewY = 0;
	
	//world container. enables changing our camera view by moving the container
	var worldContainer = new PIXI.DisplayObjectContainer();
	worldContainer.position = new PIXI.Point(Math.round(-(world.getPlayerStartPosition(playerIndex).x - camera.viewWidth / 2)), 
												Math.round(-(world.getPlayerStartPosition(playerIndex).y - camera.viewHeight / 2)));
	stage.addChild(worldContainer);
	
	//background gradient
	var worldBackground = new PIXI.Sprite.fromFrame("gradient.png");
	worldBackground.width = camera.viewWidth;
	worldBackground.height = camera.viewHeight;
	worldContainer.addChild(worldBackground); //add background to worldContainer
	//how we handle grab move and click events
	var worldBlockSprites = new Array(0);
	var maxWorldObjects = 400;
	var worldObjectSprites = new Array(maxWorldObjects);
	
	$(window).mouseleave(onMouseGrabEndOutside);
	$(window).mousedown(onMouseDown);
	$(window).mouseup(onMouseUp);
	$(window).click(onClick);
	$(window).mousemove(onMouseMove);	
	
	stage.interactive = true;
	stage.touchstart = onTouchDown;
	stage.touchend = onTouchUp;
	stage.touchmove = onTouchMove;
	stage.touchendoutside = onTouchGrabEndOutside;
	
	//create world sprites used for drawing world blocks to client screen
	createWorldBlockSprites();
	//create world object sprites used to draw buildings and objects in game
	createWorldObjectSprites();
	
	// user interface
	userInterface = new gameUI();
	
	//convert input pos to world coords
	function convertPosToWorldCoordsX(inputPos){
		return Math.ceil((Math.abs(worldContainer.position.x) / world.getWorldBlockSize()) + (inputPos.x / world.getWorldBlockSize())) - 1;
	}
	function convertPosToWorldCoordsY(inputPos){
		return Math.ceil((Math.abs(worldContainer.position.y) / world.getWorldBlockSize()) + (inputPos.y / world.getWorldBlockSize())) - 1;
	}
	
	function onClick( event ) {
		areWeDragging = false;
		if(didWeJustDrag) { didWeJustDrag = false; return; }

		clickPos = new PIXI.Point(event.clientX, event.clientY);
		var iX = convertPosToWorldCoordsX(clickPos);
		var iY = convertPosToWorldCoordsY(clickPos);
		
		//returns true if game object selected
		if(world.playerClickWorld(playerIndex, iX, iY)){
			var tmpX = event.clientX;
			var tmpY = event.clientY;
			if(tmpX + 128 > camera.viewWidth){ tmpX = camera.viewWidth - 128; }
			if(tmpY + 128 > camera.viewHeight){ tmpY = camera.viewHeight - 128; }
			userInterface.setPopupWindow(tmpX, tmpY);
		} else {
			userInterface.disablePopupWindow();
		}
		
		
		
		updateWorldBlockSprites();
	}
  
	function onMouseDown( event ){
	  inputJustDown = true;
	  didWeJustDrag = false;
	  worldGrabStartX = event.clientX;
	  worldGrabStartY = event.clientY;
	  
	  setWorldOldPosition();
	}
	function onMouseUp( event ){
	  inputJustDown = false;
	  areWeDragging = false;
	  //console.log("end grab");
	}
	//if mouse goes outside window
	function onMouseGrabEndOutside( event ){
	  areWeDragging = false;
	  //console.log(event.clientX);
	}
	function onMouseMove( event ){
		if(event.clientX < worldGrabStartX - 8 || event.clientX > worldGrabStartX + 8 ||
				event.clientY < worldGrabStartY - 8 || event.clientY > worldGrabStartY + 8){
			
			if(inputJustDown){
				  inputJustDown = false;
				  areWeDragging = true;
			}
		}
	  
	  if(areWeDragging){
		  setWorldNewPosition(event.clientX - worldGrabStartX, event.clientY - worldGrabStartY);
		  dragWorldCameraUpdate();
		  didWeJustDrag = true;
	  }
	}
	
	// touch
	function onTouchDown( event ){
		var eventPosition = event.getLocalPosition(worldContainer);
		inputJustDown = true;
		didWeJustDrag = false;
		worldGrabStartX = eventPosition.x;
		worldGrabStartY = eventPosition.y;
		  
		setWorldOldPosition();
		
		touchDebug.setText("onTouchDown " + eventPosition.x + " x " + eventPosition.y);
	}
	function onTouchUp( event ){
		var eventPosition = event.getLocalPosition(worldContainer);
		
		inputJustDown = false;
		areWeDragging = false;
	  
		touchDebug.setText("onTouchUp " + eventPosition.x + " x " + eventPosition.y);
	}
	//if mouse goes outside window
	function onTouchGrabEndOutside( event ){
		var eventPosition = event.getLocalPosition(worldContainer);
		areWeDragging = false;
		//console.log(event.clientX);
		touchDebug.setText("onTouchGrabEndOutside " + eventPosition.x + " x " + eventPosition.y);
	}
	function onTouchMove( event ){
		var eventPosition = event.getLocalPosition(worldContainer);
		
		if(eventPosition.x < worldGrabStartX - 8 || eventPosition.x > worldGrabStartX + 8 ||
				eventPosition.y < worldGrabStartY - 8 || eventPosition.y > worldGrabStartY + 8){
			
			if(inputJustDown){
				  inputJustDown = false;
				  areWeDragging = true;
			}
		}
	  
	  if(areWeDragging){
		  setWorldNewPosition(eventPosition.x - worldGrabStartX, eventPosition.y - worldGrabStartY);
		  dragWorldCameraUpdate();
		  didWeJustDrag = true;
	  }
	  
	  touchDebug.setText("onTouchMove " + eventPosition.x + " x " + eventPosition.y);
	}
	//end events
	////////////
		
	//background
	function updateBackground(){
		worldBackground.position = camera.viewPosition;
	}
	
	/////////////////////////////////
	//world block sprites we draw to screen
	function getWorldSpriteArraySize(){
		var arraySize = ((camera.viewWidth + 3.7 * world.getWorldBlockSize()) / world.getWorldBlockSize()) * 
		((camera.viewHeight + 3.7 * world.getWorldBlockSize()) / world.getWorldBlockSize());

		console.log(Math.round(arraySize));
		
		return Math.round(arraySize);
	}
	function createWorldBlockSprites(){
		
		worldBlockSprites = new Array(getWorldSpriteArraySize());
		for(var i = 0; i < worldBlockSprites.length; i++){
			worldBlockSprites[i] = PIXI.Sprite.fromFrame("blank.png");
			worldBlockSprites[i].visible = false;
			worldContainer.addChild(worldBlockSprites[i]);
		}
		
	 	checkWorldBoundsUpdateCamera();
		
		updateWorldBlockSprites();
	}
	function resizeWorldSprites(){
		
		if(worldBlockSprites.length === 0){ return; }
		
		for(var i = 0; i < worldBlockSprites.length; i++){
			worldContainer.removeChild(worldBlockSprites[i]); 
		}
		worldBlockSprites.length = 0;
		
		worldBlockSprites = new Array(getWorldSpriteArraySize());
		for(var i = 0; i < worldBlockSprites.length; i++){
			worldBlockSprites[i] = PIXI.Sprite.fromFrame("blank.png");
			worldBlockSprites[i].visible = false;
			worldContainer.addChild(worldBlockSprites[i]);
		}
		
	 	checkWorldBoundsUpdateCamera();
		
		updateWorldBlockSprites();
	}
	
	function updateWorldBlockSprites(){	
		//update background
		updateBackground();
		
		//make all sprites invisible
		for(var i = 0; i < worldBlockSprites.length; i++){
			worldBlockSprites[i].visible = false;
		}
		
		var startX = Math.round(camera.viewPosition.x / world.getWorldBlockSize());
		startX = startX - 1;
		if(startX < 0){startX = 0;}
		var startY = Math.round(camera.viewPosition.y / world.getWorldBlockSize());
		startY = startY - 1;
		if(startY < 0){startY = 0;}
		
		var endX = Math.round((camera.viewPosition.x + camera.viewWidth) / world.getWorldBlockSize());
		endX = endX + 1;
		if(endX >= world.getWorldWidth()){endX = world.getWorldWidth() - 1;}
		var endY = Math.round((camera.viewPosition.y + camera.viewHeight) / world.getWorldBlockSize());
		endY = endY + 1;
		if(endY >= world.getWorldHeight()){endY = world.getWorldHeight() - 1;}	
		
		var spriteCount = 0;
		var tmpTexture;
		for(var iX = startX; iX <= endX; iX++){
			for(var iY = startY; iY <= endY; iY++){
				if(world.getWorldGridBlockType(iX, iY) != BLOCKTYPENONE){ //if it isn't nothing
					
					tmpTexture = PIXI.Texture.fromFrame(world.getWorldGridFrameName(iX, iY));
					worldBlockSprites[spriteCount].setTexture(tmpTexture);
					worldBlockSprites[spriteCount].position = world.getWorldGridPosition(iX, iY);
					worldBlockSprites[spriteCount].visible = true;
					
					spriteCount++; 
					if(spriteCount > worldBlockSprites.length - 1){ spriteCount = 0; }
					
				}
			}		
		}
	
	}
	
	///////////////////////
	// world object sprites
	function createWorldObjectSprites(){
		for(var i = 0; i < worldObjectSprites.length; i++){
			worldObjectSprites[i] = PIXI.Sprite.fromFrame("base.png");
			worldObjectSprites[i].visible = false;
			worldContainer.addChild(worldObjectSprites[i]);
		}
	}
	
	//makes sure camera view inside world container
	function checkWorldBoundsUpdateCamera(){
		//x pos check  
		if(worldContainer.position.x < -(world.getWorldWidth() * world.getWorldBlockSize()) + camera.viewWidth){
			worldContainer.position.x = -(world.getWorldWidth() * world.getWorldBlockSize()) + camera.viewWidth;
		}
		if(worldContainer.position.x > 0){
			worldContainer.position.x = 0;
		}
		//y pos check
		if(worldContainer.position.y < -(world.getWorldHeight() * world.getWorldBlockSize()) + camera.viewHeight){
			worldContainer.position.y = -(world.getWorldHeight() * world.getWorldBlockSize()) + camera.viewHeight;
		}
		if(worldContainer.position.y > 0){
			worldContainer.position.y = 0;
		}
		//set new camera view position
		camera.viewPosition = new PIXI.Point(Math.abs(worldContainer.position.x), Math.abs(worldContainer.position.y));
		camera.viewPosRight = camera.viewPosition.x + camera.viewWidth;
		camera.viewPosBottom = camera.viewPosition.y + camera.viewHeight;
	}
	
	function dragWorldCameraUpdate(){
		worldContainer.position.x = worldOldX + worldNewX;
	 	worldContainer.position.y = worldOldY + worldNewY;
		
	 	checkWorldBoundsUpdateCamera();
			
	 	updateWorldBlockSprites();
	}

	function setWorldOldPosition(oldPosX, oldPosY){ worldOldX = worldContainer.position.x; worldOldY = worldContainer.position.y; };
	function setWorldNewPosition(newPosX, newPosY){ worldNewX = newPosX; worldNewY = newPosY; };
	
	this.performResizeClientView = function(){
		camera.viewWidth = window.innerWidth;
		camera.viewHeight = window.innerHeight;
		worldBackground.width = camera.viewWidth;
		worldBackground.height = camera.viewHeight;
		resizeWorldSprites();
	};
	
}