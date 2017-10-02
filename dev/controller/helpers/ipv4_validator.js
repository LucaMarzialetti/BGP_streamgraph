function IPv4_Validator(){

}

IPv4_Validator.prototype.checkipv4 = function(str) {
	try {
		var blocks = str.split(".");
		if(blocks.length==4 && blocks.every(function (e) {e=parseInt(e); return e>=0 && e<=255;})) {
			var mask = str.split("/");
			if(mask.length==1 || (mask.length==2 && parseInt(mask[1])<=32 && parseInt(mask[1])>0))  
				return true;
		}
	}
	catch(e){
		return false;
	}
	return false;
}