function gameUI(){
	uIContainer = new PIXI.DisplayObjectContainer();
	uIContainer.position = new PIXI.Point(0, 0);
	stage.addChild(uIContainer);
	
	//touch debug
	var messageOut = new PIXI.Text("", {font:"11px Arial", fill:"white"});
	messageOut.position.x = 8;
	messageOut.position.y = 256;
	stage.addChild(messageOut);
	
	// ui popup window
	var popupWindow = new PIXI.Sprite.fromFrame("stone01.png");
	popupWindow.position = new PIXI.Point(200, 200);
	popupWindow.width = 128;
	popupWindow.height = 128;
	popupWindow.visible = false;
	uIContainer.addChild(popupWindow);
	
	
	//messageOut.setText("game user interface");
	
	this.setMessageOut = function(msg){
		messageOut.setText(msg);
	};
	
	this.setPopupWindow = function(xPos, yPos){
		popupWindow.position.x = xPos;
		popupWindow.position.y = yPos;
		popupWindow.visible = true;
	};
	this.disablePopupWindow = function(){ popupWindow.visible = false; };
}