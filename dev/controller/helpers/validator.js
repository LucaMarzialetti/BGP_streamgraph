function Validator(){
	this.ipv6_validator = new IPv6_Validator();
	this.ipv4_validator = new IPv4_Validator();
	this.date_validator = new Date_Validator();
	this.asn_validator = new ASN_Validator();
}

Validator.prototype.check_date = function(str){
	return this.date_validator.checkdate(str);
}

Validator.prototype.check_date_with_format = function(str, format){
	return this.date_validator.checkdate_format(str,format);
}


Validator.prototype.check_ipv4 = function(str){
	return this.ipv4_validator.checkipv4(str);
}

Validator.prototype.check_ipv6 = function(str){
	return this.ipv6_validator.checkipv6(str);
}

Validator.prototype.check_asn = function(str){
	return this.asn_validator.checkasn(str);
}