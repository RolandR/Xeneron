var Aux = new function(){

	var vector = new function(){
	
		function polarToCartesian(polarVector){
			var xComponent = polarVector[0]	* Math.sin(polarVector[1] * (Math.PI / 180));	
			var yComponent = polarVector[0]	* Math.cos(polarVector[1] * (Math.PI / 180));	
			
			return [xComponent, yComponent];
		}
		
		function cartesianToPolar(cartesianVector){
			var vectorLength = Math.sqrt(Math.pow(cartesianVector[0], 2) + Math.pow(cartesianVector[1], 2));
			if(cartesianVector[1] != 0){
				var angle = Math.atan(cartesianVector[0] / cartesianVector[1]);
			} else {
				var angle = 0;
			}
			
			angle = angle * (180 / Math.PI)
			
			return [vectorLength, angle];
		}
		
		return{
			 polarToCartesian: polarToCartesian
			,cartesianToPolar: cartesianToPolar
		}
		
	}
	
	return{
		vector: vector
	}
}