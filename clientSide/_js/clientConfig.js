var Config = {
	 tileset: {
		 tilesetWidth: 10				// Fields in the tileset
		,tilesetHeight: 10
		,tileWidth: 16					// Pixels per tile
		,tileHeight: 16
		,tilesetBorder: 1				// Border between tiles
	}
	,partCfg: {
		 maxLayers: 3
	}
	,parts:{
		 hull: {
			 partID: 0 					// Starting part ID - lvl 3 of this part would be ID 3, for example.
			,maxLevel: 7				// Levels start at 0.
			,layer: 0					// Layer 0: Hull - Layer 1: Things that do stuff - Layer 2: Panels/Decorative.
		}
		,core: {
			 partID: 10
			,maxLevel: 0
			,layer: 1
		}
		,engine: {
			 partID: 20
			,maxLevel: 0
			,layer: 1
		}
		,blaster: {
			 partID: 30
			,maxLevel: 0
			,layer: 1
		}
	}
	,graphics: {
		 scale: 1
		,pixelPerMeter: 16
	}
}