function PQNode() {
	//NODE VARIABLES
	this.id=0;						//id of a node
	this.childCount=0;				//counter, only P
	this.pertinentChildCount=0;		//counter
	this.pertinentLeafCount=0;		//counter

	this.parent=null;				//link to parent node
	this.parentType=null;			//type of the parent
	this.label=null;				//ENUM: empty/full/partial
	this.mark=null;					//ENUM: unmarked/marked or blocked/unblocked
	this.type=null;					//ENUM: leaf/P/Q

	this.circularLink=undefined; 	//is a set, only P 		<----------------REQUIRE SORTED CIRCULAR DOUBLY LINKED LIST
	this.endmost2Childrens=[]; 		//is a set, length [0-2], only Q 		
	this.fullChildrens=[];			//is a set, both P & Q 	
	this.fullChildrensSize=0;
	this.immediateSiblings=[];		//is a set, lenght [0-2], both P & Q	
	this.partialChildrens=[];		//is a set, lenght [0-2]
}

//CHILD COUNT
PQNode.prototype.getChildCount = function() {
		return this.childCount;
};

PQNode.prototype.setChildCount = function(e) {
		this.childCount=e;
};

PQNode.prototype.incrementChildCount = function() {
		this.childCount++;
};

PQNode.prototype.decrementChildCount = function() {
	this.childCount--;
};

//PERTINENT CHILD COUNT
PQNode.prototype.getPertinentChildCount = function() {
	return this.pertinentChildCount;
};

PQNode.prototype.setPertinentChildCount = function(e) {
	this.pertinentChildCount=e;
};

PQNode.prototype.incrementPertinentChildCount = function() {
	this.pertinentChildCount++;
};

PQNode.prototype.decrementPertinentChildCount = function() {
	this.pertinentChildCount--;
};

//PERTINENT LEAF COUNT
PQNode.prototype.getPertinentLeafCount = function() {
	return this.pertinentLeafCount;
};

PQNode.prototype.setPertinentLeafCount = function(e) {
	this.pertinentLeafCount=e;
};

PQNode.prototype.incrementPertinentLeafCount = function() {
	this.pertinentLeafCount++;
};

PQNode.prototype.decrementPertinentLeafCount = function() {
	this.pertinentLeafCount--;
};

//PARENT
PQNode.prototype.getParent = function() {
	return this.parent;
};

PQNode.prototype.setParent = function(e) {
	this.parent=e;
};

PQNode.prototype.hasParent = function(e) {
	return (this.parent!=null && this.parent!=undefined);
};

//LABEL
PQNode.prototype.getLabel = function() {
	return this.label;
};

PQNode.prototype.setLabel = function(e) {
	this.label=e;
};

//MARK
PQNode.prototype.getMark = function() {
	return this.mark;
};

PQNode.prototype.setMark = function(e) {
	this.mark=e;
};

//TYPE
PQNode.prototype.getType = function() {
	return this.type;
};

PQNode.prototype.setType = function(e) {
	this.type=e;
};

//CIRCULAR LINK
PQNode.prototype.initCircularLink = function() {
	//this.circularLink;
};

PQNode.prototype.getCircularLink = function() {
	return this.circularLink;
};

PQNode.prototype.addToCircularLink = function(e) {
	//this.circularLink.(e);
};

PQNode.prototype.removeFromCircularLink = function() {
	//return this.circularLink.();
};

PQNode.prototype.sizeOfCircularLink = function() {
	//return this.circularLink.;
};

//ENDMOST 2 CHILDRENS
PQNode.prototype.initEndmost2Childrens = function() {
	this.endmost2Childrens=[];
};

PQNode.prototype.getEndmost2Childrens = function() {
	return this.endmost2Childrens;
};

PQNode.prototype.addToEndmost2Childrens = function(e) {
	if(!this.endmost2Childrens.contains(e))
		this.endmost2Childrens.push(e);
};

PQNode.prototype.removeFromEndmost2Childrens = function(e) {
	var i = this.endmost2Childrens.indexOf(e);
	if(i > -1) {
		this.endmost2Childrens.splice(i,1);
	}
};

PQNode.prototype.sizeOfEndmost2ChildrenSet = function() {
	return this.endmost2Childrens.length;
};

//FULL CHILDRENS
PQNode.prototype.initFullChildrens = function() {
	this.fullChildrens=[];
};

PQNode.prototype.getFullChildrens = function() {
	return this.fullChildrens;
};

PQNode.prototype.addToFullChildrens = function(e) {
	if(!this.fullChildrens.contains(e)) {
		this.fullChildrens.push(e);
		this.fullChildrensSize++;
	}
};

PQNode.prototype.removeFullChildrens = function(e) {
	var i = this.fullChildrens.indexOf(e);
	if(i > -1) {
		this.fullChildrens.splice(i,1);
		this.fullChildrensSize--;
	}
};

PQNode.prototype.sizeOfFullChildrens = function() {
	return this.fullChildrensSize;
};

//IMMEDIATE SIBLINGS

PQNode.prototype.initImmediateSiblings = function() {
	this.immediateSiblings=[];
};

PQNode.prototype.getImmediateSiblings = function() {
	return this.immediateSiblings;
};

PQNode.prototype.addToImmediateSiblings = function(e) {
	if(!this.immediateSiblings.contains(e))
		return this.immediateSiblings.push(e);
};

PQNode.prototype.removeFromImmediateSiblings = function(e) {
	var i = this.immediateSiblings.indexOf(e);
	if(i > -1) {
		this.immediateSiblings.splice(i,1);
	}
};

PQNode.prototype.sizeOfImmediateSiblings = function() {
	return this.immediateSiblings.length;
};

//PARTIAL CHILDRENS
PQNode.prototype.initPartialChildrens = function() {
	this.partialChildrens=[];
};

PQNode.prototype.getPartialChildrens = function() {
	return this.partialChildrens;
};

PQNode.prototype.addToPartialChildrens = function(e) {
	if(!this.partialChildrens.contains(e))
		return this.partialChildrens.push(e);
};

PQNode.prototype.removeFromPartialChildrens = function(e) {
	var i = this.partialChildrens.indexOf(e);
	if(i > -1) {
		this.partialChildrens.splice(i,1);
	}
};

PQNode.prototype.sizeOfPartialChildrens = function() {
	return this.partialChildrens.length;
};

PQNode.prototype.pq_internal_node = function(){

};