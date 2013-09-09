var players = [
	{
		 playerID: 0
		,name: 'draemmli'
		,shipPlan: {
			 shipID: 0
			,width: 5
			,height: 5
			,parts: [
				 {
					 type: Config.parts.hull
					,level: 4
					,xPos: 2
					,yPos: 2
				}
				,{
					 type: Config.parts.core
					,level: 0
					,xPos: 2
					,yPos: 2
					,orientation: 0
				}
				,{
					 type: Config.parts.hull
					,level: 2
					,xPos: 2
					,yPos: 1
				}
				,{
					 type: Config.parts.blaster
					,level: 0
					,xPos: 2
					,yPos: 1
					,orientation: 0
				}
				,{
					 type: Config.parts.hull
					,level: 1
					,xPos: 2
					,yPos: 3
				}
				,{
					 type: Config.parts.engine
					,level: 0
					,xPos: 2
					,yPos: 3
					,orientation: 0
				}
			]
		}
	}
];

players = [
	{
		 playerID: 0
		,name: 'draemmli'
		,pos: {
			x: 500,
			y: 210,
			angle: 110
		}
		,weight: 2000	// Kilogram
		,thrust: 30000	// Newton
		,shipPlan: {
			 shipID: 0
			,width: 5
			,height: 5
			,parts: [
				,{
					 type: Config.parts.core
					,level: 0
					,xPos: 2
					,yPos: 2
					,orientation: 0
				}
				,{
					 type: Config.parts.blaster
					,level: 0
					,xPos: 2
					,yPos: 1
					,orientation: 0
				}
				,{
					 type: Config.parts.blaster
					,level: 0
					,xPos: 3
					,yPos: 2
					,orientation: 1
				}
				,{
					 type: Config.parts.blaster
					,level: 0
					,xPos: 1
					,yPos: 2
					,orientation: 3
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
			]
		}
	}
];


Display.prerenderShip(players[0].shipPlan);


var start = new Date().getTime();

Display.Game.updateBackground({x: 4000, y: 1200});

var end = new Date().getTime();
var time = end - start;
console.log('Execution time: ' + time +'ms');


Display.Game.renderToGame($('#ship-id-'+players[0].shipPlan.shipID)[0], players[0].pos, players[0].pos.angle);

























