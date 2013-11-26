// global object types
var GAMEOBJTYPENONE = 0, GAMEOBJTYPEBASE = 1;

function gameObject(){
	
	var gameObjectIndex = null;
	var objType = GAMEOBJTYPENONE;
	var enabled = false;
	var playerOwner = "";
	var position = new PIXI.Point(0, 0);
	var health = 100;
	
	//stored grid info
	var gridX = 0, gridY = 0; //this is the origin grid coord of the object (bottom left corner if larger than one block)
	var blocksWide = 0, blocksHigh = 0;
	
	//main base
	function spawnMainBase(worldGrid){
		worldGrid[gridX][gridY].blockType = BLOCKTYPEGAMEOBJECT;
		worldGrid[gridX][gridY].frameName = "stone01.png";
		worldGrid[gridX][gridY].gameObjectIndex = gameObjectIndex;
		worldGrid[gridX+1][gridY].blockType = BLOCKTYPEGAMEOBJECT;
		worldGrid[gridX+1][gridY].frameName = "stone01.png";
		worldGrid[gridX+1][gridY].gameObjectIndex = gameObjectIndex;
		worldGrid[gridX][gridY-1].blockType = BLOCKTYPEGAMEOBJECT;
		worldGrid[gridX][gridY-1].frameName = "stone01.png";
		worldGrid[gridX][gridY-1].gameObjectIndex = gameObjectIndex;
		worldGrid[gridX+1][gridY-1].blockType = BLOCKTYPEGAMEOBJECT;
		worldGrid[gridX+1][gridY-1].frameName = "stone01.png";
		worldGrid[gridX+1][gridY-1].gameObjectIndex = gameObjectIndex;
				
		blocksWide = 2;
		blocksHigh = 2;
	}
	
	this.spawnGameObject = function(worldGrid, iX, iY, typ, playOwn, gOIndex){
		playerOwner = playOwn;
		//position = pos;
		objType = typ;
		enabled = true;
		gridX = iX;
		gridY = iY;
		gameObjectIndex = gOIndex;
		
		switch(objType){
		case GAMEOBJTYPENONE:
			
			break;
		case GAMEOBJTYPEBASE:
			spawnMainBase(worldGrid);
			break;
		}
	};
	
	this.getGameObjectGridX = function(){ return gridX; };
	this.getGameObjectGridY = function(){ return gridY; };
	this.getGameObjectBlocksWide = function(){ return blocksWide; };
	this.getGameObjectBlocksHigh = function(){ return blocksHigh; };
	

}