define([
	"bgpst.lib.moment"
], function(moment){

	var DateValidator = function(){

	};

	DateValidator.prototype.checkdate = function(str){
		if(str&&str != "")
			try {
				return moment(str).isValid();
			}
			catch(e) {
				return false;
			}
		else
			return false;
	};

	DateValidator.prototype.checkdate_format = function(str,format){
		if(str && str != "")
			try{
				return moment(str,format,true).isValid();
			}
			catch(e){
				return false;
			}
		else
			return false;
	};

	return DateValidator;
});