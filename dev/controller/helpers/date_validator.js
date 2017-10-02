function Date_Validator(){

}

Date_Validator.prototype.checkdate = function(str){
	if(str&&str!="")
		try {
			return moment(str).isValid();
		}
		catch(e) {
			return false;
		}
	else
		return false;
}

Date_Validator.prototype.checkdate_format = function(str,format){
	if(str&&str!="")
		try{
			return moment(str,format,true).isValid();
		}
		catch(e){
			return false;
		}
	else
		return false;
}