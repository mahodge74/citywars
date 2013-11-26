function gamePlayer(playIndex, playNme){
	var playerIndex = playIndex;
	var enabled = false;
	var name = playNme;
	var score = 0;
	
	//stores the starting position of players base
	var startPos = new PIXI.Point();
	
	//game object select
	var isGameObjectSelected = false;
	var selectedGameObjectIndex = null;
	
	//get player index
	this.getPlayerIndex = function(){ return playerIndex; };
	
	//start position
	this.getPlayerStartPosition = function(){ return startPos; };
	this.setPlayerStartPosition = function(plPos){ startPos = plPos; };
	
	//game object selection
	this.setSelectGameObject = function(gOIndex){
		isGameObjectSelected = true;
		selectedGameObjectIndex = gOIndex;
		console.log("selected object " +  selectedGameObjectIndex);
	};
	this.deselectAllGameObjects = function(){
		isGameObjectSelected = false;
		selectedGameObjectIndex = null;
	};
}