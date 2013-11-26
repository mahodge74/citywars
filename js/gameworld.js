// global block type constants
var BLOCKTYPENONE = 0, BLOCKTYPEDIRT = 1, BLOCKTYPEGRASS = 2, BLOCKTYPEGAMEOBJECT = 3;

//to calculate distance
function lineDistance( point1, point2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

function gameWorld(){
	//world and screen grid variables
	//we have a larger world of block types and a screen array of block
	//that we render. we can move screen position around world array
	var worldWidth = 400, worldHeight = 200;
	var worldMinWidth = 100, worldMinHeight = 50;
	var worldBlockSize = 16;
	var lowRangeStartArea = 20, highRangeStartArea = 60;
	var worldGrid = new Array(0); //whole world information
	
	//game objects
	var gameObjects = new Array(0);
	
	//players
	var players = new Array(0);
	
	createWorld();
	
	spawnPlayer("Joe Bloggs");
	
	function createWorld(){
		
		createRandomTerrain();
		
		for(var i = 0; i < 200; i++){
			gameObjects[i] = new gameObject();
		}
	}
	
	///////////////////////////////////////////////
	// LARGE random world creation function up ahead
	function createRandomTerrain(){
		//first check world sizes not to small
		if(worldWidth < worldMinWidth){ worldWidth = worldMinWidth; }
		if(worldHeight < worldMinHeight){ worldHeight = worldMinHeight; }
		
		//world map grid
		//first we just create the whole array
		worldGrid = new Array(worldWidth);
		for(var iX = 0; iX < worldWidth; iX++){
			worldGrid[iX] = new Array(worldHeight);
			for(var iY = 0; iY < worldHeight; iY++){
				worldGrid[iX][iY] = new Object();
				worldGrid[iX][iY].blockType = BLOCKTYPENONE;
				worldGrid[iX][iY].frameName = "blank.png";
				worldGrid[iX][iY].position = new PIXI.Point(iX * worldBlockSize, iY * worldBlockSize);
			}
		}
		
		//random generation
		var lastHeight = Math.round(worldHeight -(worldMinHeight / 3));

		for(var iX = 0; iX < (worldWidth / 2); iX++){
			
			//randomize when not in start flat area
			if(iX < lowRangeStartArea || iX > highRangeStartArea){
				var rndNum = Math.random();
				if(rndNum < 0.5){ lastHeight--; lastHeight--; }
				if(rndNum >= 0.5){ lastHeight++;}
			}
			
			if(lastHeight < 5){ lastHeight = 5; }
			
			// 1/4 of last height
			var	qLastHeight = Math.round((worldHeight - lastHeight) / 4);
			
			for(var iY = (worldHeight - 1); iY > 0; iY--){ //y in reverse
				if(iY > lastHeight){
					worldGrid[iX][iY].blockType = BLOCKTYPEDIRT;
					worldGrid[iX][iY].frameName = getRandomDirtTexture(0);
				}
				if(iY > lastHeight + qLastHeight){
					worldGrid[iX][iY].blockType = BLOCKTYPEDIRT;
					worldGrid[iX][iY].frameName = getRandomDirtTexture(1);
				}
				if(iY > lastHeight + qLastHeight*2){
					worldGrid[iX][iY].blockType = BLOCKTYPEDIRT;
					worldGrid[iX][iY].frameName = getRandomDirtTexture(2);
				}
				if(iY > lastHeight + qLastHeight*3){
					worldGrid[iX][iY].blockType = BLOCKTYPEDIRT;
					worldGrid[iX][iY].frameName = getRandomDirtTexture(3);
				}
			}
		}
		
		//smooth out rough parts
		for(var iX = 1; iX < (worldWidth / 2); iX++){
			for(var iY = 1; iY < worldHeight - 1; iY++){
				//check not right at edge of world for array saftey net
				if(worldGrid[iX][iY].blockType != BLOCKTYPENONE ){
					//
					if(worldGrid[iX - 1][iY].blockType === BLOCKTYPENONE &&
							worldGrid[iX][iY - 1].blockType === BLOCKTYPENONE &&
							worldGrid[iX + 1][iY].blockType === BLOCKTYPENONE){
						
						worldGrid[iX][iY].blockType = BLOCKTYPENONE;
						worldGrid[iX][iY].frameName = "blank.png";
						worldGrid[iX+1][iY].blockType = BLOCKTYPENONE;
						worldGrid[iX+1][iY].frameName = "blank.png";
						worldGrid[iX-1][iY].blockType = BLOCKTYPENONE;
						worldGrid[iX-1][iY].frameName = "blank.png";
						break;
					}
				}

			}
		}
		
		
		//grass topping
		var grassLevels;
		for(var iX = 1; iX < (worldWidth / 2); iX++){
			grassLevels = 0;
			for(var iY = 1; iY < worldHeight - 1; iY++){
				//check not right at edge of world for array saftey net
				if(worldGrid[iX][iY].blockType != BLOCKTYPENONE ){
						worldGrid[iX][iY].blockType = BLOCKTYPEGRASS;
						worldGrid[iX][iY].frameName = getRandomGrassTexture();
						grassLevels++;
						if(grassLevels > 1){ break; }
				}
			}
		}
		
		//flip copy to second half of world
		for(var iX = 0; iX < (worldWidth / 2); iX++){
			for(var iY = 0; iY < worldHeight; iY++){
				if(worldGrid[iX][iY].blockType != BLOCKTYPENONE){
					worldGrid[worldWidth - iX - 1][iY].blockType = worldGrid[iX][iY].blockType;
					switch(worldGrid[iX][iY].blockType){
					case BLOCKTYPEDIRT:
						worldGrid[worldWidth - iX - 1][iY].frameName = worldGrid[iX][iY].frameName;
						break;
					case BLOCKTYPEGRASS:
						worldGrid[worldWidth - iX - 1][iY].frameName = getRandomGrassTexture(60);
						break;
					}
					
				}
			}
		}
	
			
	}
	// end of LARGE random world creation
	/////////////////////////////////////
	
	this.getWorldBlockSize = function(){ return worldBlockSize; };
	this.getWorldWidth = function(){ return worldWidth; };
	this.getWorldHeight = function(){ return worldHeight; };
	//get world grid properties
	this.getWorldGridFrameName = function(iX, iY) { return worldGrid[iX][iY].frameName; };
	this.getWorldGridPosition = function(iX, iY) { return worldGrid[iX][iY].position; };
	this.getWorldGridBlockType = function(iX, iY) { return worldGrid[iX][iY].blockType; };
	
	///////////////
	// game objects
	function spawnGameObject(iX, iY, typ, playIndex){
		//find next disabled game object
		for(var i = 0; i < gameObjects.length; i++){
			if(gameObjects[i].enabled === false){
				break;
			}
			
			//spawn
			gameObjects[i].spawnGameObject(worldGrid, iX, iY, typ, playIndex, i);
		}
		
	};
	this.getGameObjectAmount = function(){ return gameObjects.length; };
	this.getGameObjectPosition = function(i){ return gameObjects[i].position; };
	
	//////////
	// players
	function spawnPlayer(playNme){ //a player is not a visible object
		var player = new gamePlayer(players.length, playNme);
		players.push(player);
		
		//players start base
		spawnPlayerBase(players[players.length-1].getPlayerIndex());
		
	}
	function spawnPlayerBase(playIndex){
		
		var iX = lowRangeStartArea + (highRangeStartArea - lowRangeStartArea) / 2;
		var iY;
		for(iY = 0; iY < worldHeight-1; iY++){
			
			if(worldGrid[iX][iY+1].blockType != BLOCKTYPENONE){
				break;
			}
		}
		spawnGameObject(iX, iY, GAMEOBJTYPEBASE, playIndex);
		players[playIndex].setPlayerStartPosition(worldGrid[iX][iY].position);
	}
	this.getAmountOfPlayers = function(){ return players.length; };
	this.getPlayerStartPosition = function(playIndex){ return players[playIndex].getPlayerStartPosition(); };
	
	////////////////////////
	// damage and projectiles
	function destroyRangeFromPoint(pos, range){
		var startPointX = Math.round((pos.x - range) / worldBlockSize);
		var startPointY = Math.round((pos.y - range) / worldBlockSize);
		startPointX--;
		startPointY--;
		
		var endPointX = Math.round((pos.x + range) / worldBlockSize);
		var endPointY = Math.round((pos.y + range) / worldBlockSize);
		endPointX++;
		endPointY++;
		for(var iX = startPointX; iX < endPointX; iX++){
			for(var iY = startPointY; iY < endPointY; iY++){
				
				if(lineDistance(pos, worldGrid[iX][iY].position) < range){
					worldGrid[iX][iY].blockType = BLOCKTYPENONE;
					worldGrid[iX][iY].frameName = "blank.png";
				}

			}
		}
		

	}
	
	/////////////////////////
	// client input to world
	// players mouse or touch
	this.playerClickWorld = function(playIndex, iX, iY){
		//first deselect anything that might be selected by player
		players[playIndex].deselectAllGameObjects();
		
		switch(worldGrid[iX][iY].blockType){
		case BLOCKTYPEGAMEOBJECT:
			players[playIndex].setSelectGameObject(worldGrid[iX][iY].gameObjectIndex);
			return true;
		case BLOCKTYPEDIRT:
		case BLOCKTYPEGRASS:
			destroyRangeFromPoint(worldGrid[iX][iY].position, 70);
			return false;
		}
		
		return false;
	};
	

}