var Display = new function(){

	var gameCanvas = document.getElementById('gameCanvas');
	var gameContext = gameCanvas.getContext('2d');
	gameContext.imageSmoothingEnabled = false;
	gameContext.mozImageSmoothingEnabled = false;
	gameContext.webkitImageSmoothingEnabled = false;	

	canvasFillWindow();


	$(window).resize(function() {
		canvasFillWindow();
	});

	function canvasFillWindow(){
		gameCanvas.width = $(window).width();
		gameCanvas.height = $(window).height();
	}
	
/*	shipPlan: {
			 width: 5
			,height: 5
			,parts: [
				 {
					 type: 'shield'
					,level: 4
					,xPos: 3
					,yPos: 3
				}*/
	
	function prerenderShip(shipPlan){
		var widthPx = shipPlan.width * Config.tileset.tileWidth;
		var heightPx = shipPlan.height * Config.tileset.tileHeight;
		
		var shipCanvas = $('#ship-id-'+shipPlan.shipID)[0];
		if(shipCanvas == undefined){
			shipCanvas = $('<canvas></canvas>');
			shipCanvas.attr('id', 'ship-id-'+shipPlan.shipID);
			shipCanvas.addClass('shipPrerender');
			$('#shipCanvases').append(shipCanvas);
		}
		
		shipCanvas = shipCanvas[0];

		var shipCanvasContext = shipCanvas.getContext('2d');
		shipCanvasContext.imageSmoothingEnabled = false;
		shipCanvasContext.mozImageSmoothingEnabled = false;
		shipCanvasContext.webkitImageSmoothingEnabled = false;
		
		shipCanvas.width = widthPx;
		shipCanvas.height = heightPx;
		
		
		for(var i = 0; i < Config.partCfg.maxLayers; i++){
			for(var part in shipPlan.parts){
				if(shipPlan.parts[part].type.layer == i){
					var orientation = 0;
					if(typeof shipPlan.parts[part].orientation != 'undefined'){
						orientation = shipPlan.parts[part].orientation * 90
					}
					
					Tiles.renderTileToCanvas(
						 shipCanvasContext
						,shipPlan.parts[part].type.partID + shipPlan.parts[part].level
						,{x: Config.tileset.tileWidth * shipPlan.parts[part].xPos
						 ,y: Config.tileset.tileHeight * shipPlan.parts[part].yPos}
						,orientation
					);
				}
			}
		}
	}

	var Tiles = new function(){
	
		
		var tilesetCanvas = initTileset();
		
		//renderTileToCanvas(gameContext, 30, {x: 200, y: 120});
		
		function initTileset(){
		
			var tilesetCanvas = $('<canvas></canvas>');
			tilesetCanvas.attr('id', 'tilesetCanvas');
			$('#preRenderCanvases').append(tilesetCanvas);
			
			tilesetCanvas = document.getElementById('tilesetCanvas');
			tilesetCanvas.width = $('#tilesetImg').width();
			tilesetCanvas.height = $('#tilesetImg').height();
			
			var tilesetContext = tilesetCanvas.getContext('2d');
			tilesetContext.imageSmoothingEnabled = false;
			tilesetContext.mozImageSmoothingEnabled = false;
			tilesetContext.webkitImageSmoothingEnabled = false;
			
			tilesetContext.drawImage($('#tilesetImg')[0], 0, 0);
			return tilesetCanvas;
			
		}
		
		// Do not render directly to the game canvas, use renderToGame() instead because of scaling
		function renderTileToCanvas(targetContext, tileNumber, pos, orientation){
			
			if(typeof orientation == 'undefined'){
				orientation = 0;
			}
			
			var tileX = tileNumber % Config.tileset.tilesetWidth;
			var tileY = (tileNumber - tileX) / Config.tileset.tilesetWidth;
			
			var tileX = tileX * Config.tileset.tileWidth + tileX * Config.tileset.tilesetBorder;
			var tileY = tileY * Config.tileset.tileHeight + tileY * Config.tileset.tilesetBorder;
			
			targetContext.save()
			targetContext.translate(pos.x, pos.y);
			targetContext.translate(Config.tileset.tileWidth / 2, Config.tileset.tileHeight / 2);
			targetContext.rotate(orientation * Math.PI/180);
			//console.log('orientation of item '+tileNumber+' is '+orientation);
			
			targetContext.drawImage(
				// Source
				tilesetCanvas, 
				tileX,
				tileY,
				Config.tileset.tileWidth, 
				Config.tileset.tileHeight, 
				// Target
				0 - Config.tileset.tileWidth/2, 
				0 - Config.tileset.tileHeight/2, 
				Config.tileset.tileWidth, 
				Config.tileset.tileHeight
			);
			
			targetContext.restore();
		}
		
		return{
			renderTileToCanvas: renderTileToCanvas
		}
	}
	
	var Game = new function(){
		
		var backgroundCanvas = initBackground();
	
		function renderToGame(sourceCanvas, pos, rotation){
			var halfSrcWidth = sourceCanvas.width;
			var halfSrcHeight = sourceCanvas.height;
			
			gameContext.save();
			gameContext.translate(pos.x + halfSrcWidth, pos.y + halfSrcHeight);
			
			gameContext.imageSmoothingEnabled = false; // I wonder why I have to do this here.
			gameContext.mozImageSmoothingEnabled = false;
			gameContext.webkitImageSmoothingEnabled = false;
			
			
			gameContext.scale(Config.graphics.scale, Config.graphics.scale);
			gameContext.rotate(rotation * Math.PI/180);
			
			gameContext.drawImage(
				sourceCanvas,
				0 - halfSrcWidth / Config.graphics.scale, 
				0 -	halfSrcHeight / Config.graphics.scale
			);
			
			gameContext.restore();
		}
		
		function initBackground(){
		
			var backgroundCanvas = $('<canvas></canvas>');
			backgroundCanvas.attr('id', 'backgroundCanvas');
			$('#preRenderCanvases').append(backgroundCanvas);
			
			backgroundCanvas = document.getElementById('backgroundCanvas');
			backgroundCanvas.width = Config.tileset.tileWidth;
			backgroundCanvas.height = Config.tileset.tileHeight;
			
			var backgroundContext = backgroundCanvas.getContext('2d');
			
			var backgroundPattern = Tiles.renderTileToCanvas(backgroundContext, 100, {x: 0, y: 0}, 0);

			return backgroundCanvas;
			
		}
		
		function updateBackground(centerPos){
			var halfGameWidth = gameCanvas.width / 2;
			var halfGameHeight = gameCanvas.height / 2;
			
			var backgroundPattern = gameContext.createPattern(
				backgroundCanvas,
				"repeat"
			);
			gameContext.fillStyle = backgroundPattern;
			gameContext.fillRect(
				 0
				,0
				,gameCanvas.width
				,gameCanvas.height
			);
			
		}
		
		function clear(){
			console.log('clearing');
			gameContext.setTransform(1, 0, 0, 1, 0, 0);
			gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		}
		
		return{
			 renderToGame: 		renderToGame
			,clear: 			clear
			,updateBackground: 	updateBackground
		}
	}
	
	return{
		 prerenderShip: prerenderShip
		,Game: Game
	}
}

































