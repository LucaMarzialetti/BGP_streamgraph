function ASN_Validator(){

}

ASN_Validator.prototype.checkasn = function(str) {
	var asnregex = "^(AS|as)?( |\s|\t)?[0-9]+$";
	var regex = new RegExp(asnregex);
	try{
		var number = str.replace(/^(A|a)(S|s)/,"").trim();
		number=parseInt(number);
		return (regex.test(str)&&number<=4294967294);
	}
	catch(e){
		return false;
	}
}