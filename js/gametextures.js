// create an array of assets to load
var assetsToLoader = ["gametextures/worldblocks.json", "gametextures/background.json", "gametextures/gameobjects.json"];

// create a new loader
loader = new PIXI.AssetLoader(assetsToLoader);

//begin load
loader.load();


function getRandomDirtTexture(layer){ //layer 0 - 3
	
	var randNum = Math.round(Math.random() * 15);
	
	switch(layer){
	case 0:
		randNum = Math.round(Math.random() * 3);
		break;
	case 1:
		randNum = 4 + Math.round(Math.random() * 3);
		break;
	case 2:
		randNum = 8 + Math.round(Math.random() * 3);
		break;
	case 3:
		randNum = 12 + Math.round(Math.random() * 3);
		break;
	}
	
	
	switch(randNum){
	case 0:
		return "dirt01.png";
	case 1:
		return "dirt02.png";
	case 2:
		return "dirt03.png";
	case 3:
		return "dirt04.png";
	case 4:
		return "dirt05.png";
	case 5:
		return "dirt06.png";
	case 6:
		return "dirt07.png";
	case 7:
		return "dirt08.png";
	case 8:
		return "dirt09.png";
	case 9:
		return "dirt10.png";
	case 10:
		return "dirt11.png";
	case 11:
		return "dirt12.png";
	case 12:
		return "dirt13.png";
	case 13:
		return "dirt14.png";
	case 14:
		return "dirt15.png";
	case 15:
		return "dirt16.png";
	}
}

function getRandomGrassTexture(){
	var randNum = Math.round(Math.random() * 4);
	switch(randNum){
	case 0:
		return "grass01.png";
	case 1:
		return "grass02.png";
	case 2:
		return "grass03.png";
	case 3:
		return "grass04.png";
	case 4:
		return "grass05.png";
	}
}