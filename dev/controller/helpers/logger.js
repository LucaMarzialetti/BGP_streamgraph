define([
], function(){
	
	var Logger = function() {
		var registred_components = {
			"context":{
				"m1":true
			},
			"gui":{
				"m1":true
			},
			"broker":{
				"m1":true
			},
			"parser":{
				"m1":true
			},
			"drawer":{
				"m1":true
			},
			"order":{
				"m1":true
			}
		};
	};

	Logger.prototype.log_to_console = function(string, caller){
		if(this.registred_components[caller]==true)
			console.log(string);
	};

	return Logger;
});