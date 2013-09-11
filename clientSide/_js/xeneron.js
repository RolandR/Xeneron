var Xeneron = new function(){

	players = [
		{
			 playerID: 0
			,name: 'draemmli'
			,pos: {
				x: 0,
				y: 0,
				angle: 0
			}
			,speed: {
				 metersPerSecond: 0
				,angle: 0
			}
			,ship: {
				 shipID: 0
				,width: 5
				,height: 5
				,mass: 2000
				,thrustVectors: []
				,parts: [
					,{
						 type: Config.parts.core
						,level: 0
						,xPos: 2
						,yPos: 2
						,orientation: 0
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 2
						,yPos: 1
						,orientation: 2
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 3
						,yPos: 2
						,orientation: 3
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 1
						,yPos: 2
						,orientation: 1
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 2
						,yPos: 3
						,orientation: 0
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 1
						,yPos: 3
						,orientation: 0
					}
					,{
						 type: Config.parts.engine
						,level: 0
						,xPos: 3
						,yPos: 3
						,orientation: 0
					}
					,{
						 type: Config.parts.blaster
						,level: 0
						,xPos: 1
						,yPos: 1
						,orientation: 0
					}
					,{
						 type: Config.parts.blaster
						,level: 0
						,xPos: 3
						,yPos: 1
						,orientation: 0
					}
				]
			}
		}
	];
	
	var Key = new function(){
		var pressedKeys = [];
		
		function isPressed(key){
			for(var i in pressedKeys){
				if(pressedKeys[i] == key){
					return true;
				}
			}
		}
		
		function pressKey(key){
			if(!isPressed(key)){
				pressedKeys.push(key);
			}
			//console.log(pressedKeys);
		}
		
		function releaseKey(key){
			var u = pressedKeys.length;
			for(var i = 0; i < u; i++){
				if(pressedKeys[i] == key){
					pressedKeys.splice(i, 1);
					u--;
					i--;
				}
			}
			//console.log(pressedKeys);
		}
		
		$(document).keydown(function(event) {
			pressKey(String.fromCharCode(event.keyCode).toLowerCase());
		});
		
		$(document).keyup(function(event) {
			releaseKey(String.fromCharCode(event.keyCode).toLowerCase());
		});
		
		return{
			isPressed: isPressed
		}
	}
	
	var Players = new function(){
		var activePlayer = players[0];
		var lastTick = -1;
		init();
		setLastTick()
		animationLoop();
		
		function init(){
			for(var id in players){
				players[id].ship = initShip(players[id].ship);
				Display.prerenderShip(players[id].ship);
			}
		}
		
		function initShip(ship){
			for(var i in ship.parts){
				if(ship.parts[i].type == Config.parts.engine){
					var key;
					switch(ship.parts[i].orientation){
						case 0:
							key = Config.keys.accelerateForward;
						break;
						case 1:
							key = Config.keys.accelerateRight;
						break;
						case 2:
							key = Config.keys.accelerateBack;
						break;
						case 3:
							key = Config.keys.accelerateLeft;
						break;
					}
					ship.thrustVectors.push(
						{
							 force: Config.parts.engine.specs.thrustPerLevel(ship.parts[i].level)
							,angle: ship.parts[i].orientation * 90
							,type: 'engine'
							,activeKey: key
						}
					);
				}
			}
			//console.log(ship.thrustVectors);
			return ship;
		}
		
		function tick(){
			for(var id in players){
				movePlayer(players[id]);
			}
			
			//activePlayer.pos.angle += 0.2;
			//activePlayer.speed.angle += 0.2;
			
			Display.Game.clear();
			Display.Game.updateBackground(activePlayer.pos);
			Display.Game.renderToGame(
				 $('#ship-id-'+players[0].ship.shipID)[0]
				,"center"
				,activePlayer.pos.angle
			);
			
			setLastTick()
		}
		
		function setLastTick(){
			lastTick = Date.now();
		}
		
		function secondsSinceLastTick(){
			return (Date.now() - lastTick)/1000;
		}

		function movePlayer(player){
			
			var cartesianActiveThrustVectors = [[0, 0]];
			var polarVectors = player.ship.thrustVectors;
			for(var i in polarVectors){
				if(Key.isPressed(polarVectors[i].activeKey)){
					cartesianActiveThrustVectors.push(
						Aux.vector.polarToCartesian(
							[polarVectors[i].force, polarVectors[i].angle + player.pos.angle]
						)
					);
				}
			}
			var singleForceVector = [0, 0];
			for(var i in cartesianActiveThrustVectors){
				singleForceVector[0] += cartesianActiveThrustVectors[i][0];
				singleForceVector[1] += cartesianActiveThrustVectors[i][1];
			}
			
			singleForceVector = Aux.vector.cartesianToPolar(singleForceVector);
			var shipAccelerationVector = [singleForceVector[0] / player.ship.mass, singleForceVector[1]];
			shipAccelerationVector = Aux.vector.polarToCartesian(shipAccelerationVector);
			var cartesianShipVelocity = Aux.vector.polarToCartesian(
				[player.speed.metersPerSecond, player.speed.angle]
			);
			
			shipAccelerationVector[0] = shipAccelerationVector[0] * secondsSinceLastTick();
			shipAccelerationVector[1] = shipAccelerationVector[1] * secondsSinceLastTick();
			
			cartesianShipVelocity[0] += shipAccelerationVector[0];
			cartesianShipVelocity[1] += shipAccelerationVector[1];
			
			var polarShipVelocity = Aux.vector.cartesianToPolar(cartesianShipVelocity);
			
			player.speed.metersPerSecond = polarShipVelocity[0];
			player.speed.angle = polarShipVelocity[1];
			
			if(player.speed.metersPerSecond > 0){
				
				var cartesianSpeed = Aux.vector.polarToCartesian(
					[player.speed.metersPerSecond, player.speed.angle]
				);
				
				player.pos.x -=	(						
					  cartesianSpeed[0]
					* secondsSinceLastTick()			
					* Config.graphics.pixelPerMeter
				);
				
				player.pos.y += (						
					  cartesianSpeed[1]	
					* secondsSinceLastTick()						
					* Config.graphics.pixelPerMeter
				);
					
			}
			
		}

		function animationLoop(){
			requestAnimFrame(animationLoop);
			tick();
		}

		/*
		Display.prerenderShip(players[0].ship);


		var start = new Date().getTime();

		Display.Game.updateBackground({x: 4000, y: 1200});

		var end = new Date().getTime();
		var time = end - start;
		console.log('Execution time: ' + time +'ms');


		Display.Game.renderToGame($('#ship-id-'+players[0].ship.shipID)[0], players[0].pos, players[0].pos.angle);

		*/
	}

}





















