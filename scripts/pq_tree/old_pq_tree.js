function PQTree() {
	//GLOBAL VARIABLES
	this.blockCount;			//counter
	this.blockedNodeds;			//counter
	this.offTheTop;				//0 or 1
	this.queue;					//fifo queue: push and shift
}

//BLOCK COUNT
PQTree.prototype.getBlockCount = function() {
	return this.blockCount;
};

PQTree.prototype.setBlockCount = function(e) {
	this.blockCount=e;
};

PQTree.prototype.incrementBlockCount = function() {
	this.blockCount++;
};

PQTree.prototype.decrementBlockCount = function() {
	this.blockCount--;
};

//BLOCKED NODES
PQTree.prototype.getBlockedNodes = function() {
	return this.blockedNodeds;
};

PQTree.prototype.setBlockedNodes = function(e) {
	this.blockedNodeds=e;
};

PQTree.prototype.incrementBlockedNodes = function() {
	this.blockedNodeds++;
};

PQTree.prototype.decrementBlockedNodes = function() {
	this.blockedNodeds--;
};

//OFF THE TOP
PQTree.prototype.getOffTheTop = function() {
	return this.offTheTop;
};

PQTree.prototype.setOffTheTop = function(val) {
	this.offTheTop=val;
};

//QUEUE
PQTree.prototype.initQueue = function() {
	this.queue=[];	
};

PQTree.prototype.getQueue = function() {
	return this.queue;	
};

PQTree.prototype.inQueue = function(e) {
	this.queue.push(e);
};

PQTree.prototype.deQueue = function() {
	return this.queue.shift();
};

PQTree.prototype.sizeOfQueue = function() {
	return this.queue.length;
};

// FUNCTIONS AND TEMPLATES
PQTree.prototype.bubble = function(t,s) {
	//todo
};

PQTree.prototype.reduce = function(t,s) {
	//to check
	t.initQueue();
	for(var i in s) {
		var x = s[i];
		t.inQueue(x);
		x.setPertinentLeafCount(1);
	}
	while(t.sizeOfQueue>0) {
		var x = t.deQueue();
		//T IS NOT ROOT
		if(x.getPertinentLeafCount() < s.length) {
			var y = x.getParent();
			y.setPertinentLeafCount(y.getPertinentLeafCount()+x.getPertinentLeafCount());
			y.decrementPertinentChildCount();
			if(y.decrementPertinentChildCount() == 0)
				t.inQueue(y);
			if((!t.templateL1(x)) && (!t.templateP1(x)) && (!t.templateP3(x)) && (!t.templateP5(x)) && (!t.templateQ1(x)) && (!t.templateQ2(x))) {
				return null; //nodo nullo?
			}
		}
		//T Is ROOT
		else {
			if((!t.templateL1(x)) && (!t.templateP1(x)) && (!t.templateP2(x)) && (!t.templateP4(x)) && (!t.templateP6(x)) && (!t.templateQ1(x)) && (!t.templateQ2(x)) && (!t.templateQ3(x))) {
				return null; //nodo nullo?
			} 
		}
	}
	return t;
};

PQTree.prototype.reduction = function(u,set) {
	//todo
	var t = null; //crea albero con tutti i vincoli
	for(var i in set) {
		var s = set[i];
		t.bubble(t,s);
		t.reduce(t,s);
	}
	return t;
};

//LEAF TEMPLATE
//TO CHECK
PQTree.prototype.templateL1 = function(node) {
	if((node.getType() == "LEAF") && (node.getLabel() == "FULL")) {
		if(!node.getOffTheTop())
			node.getParent().addToFullChildrens(node);
		return true;
	}
	else 
		return false;

};

//P NODE TEMPLATE
//TO CHECK
PQTree.prototype.templateP1 = function(node) {
	if((node.getType() != "PNODE") || (node.sizeOfFullChildrens() != node.getChildCount()))
		return false;
	else {
		node.setLabel("FULL");
		if(!node.getOffTheTop())
			node.getParent().addToFullChildrens(node);
		return true;
	}
};

//TO CHECK
PQTree.prototype.templateP2 = function(node) {
	if((node.getType() != "PNODE") || (node.sizeOfPartialChildrens() > 0))
		return false;
	else {
		node.setChildCount(node.getChildCount()-node.sizeOfFullChildrens()+1);
		//MISSING methods
		var new_node = createNodeAndCopyFullChildren(node.getFullChildrens());
		new_node.setParent(node);
		new_node.addToImmediateSiblings();
		return true;
	}
};

//TO CHECK
PQTree.prototype.templateP3 = function(x) {
	//todo

};

//TO CHECK
PQTree.prototype.templateP4 = function(x) {
	//todo
	if(x.getType() != "PNODE" || x.sizeOfPartialChildrens() != 1)
		return false;
	else {
		var partial_child = x.removeFromPartialChildrens();
		//MISSING methods
		return true;
	}
};

//TO CHECK
PQTree.prototype.templateP5 = function(x) {
	//todo
};

//TO CHECK
PQTree.prototype.templateP6 = function(x) {
	//todo
};

//TO CHECK
PQTree.prototype.templateQ1 = function(x) {
	//todo
	if(x.getType() == "QNODE")
		return false;
};

//TO CHECK
PQTree.prototype.templateQ2 = function(x) {
	//todo
};

//TO CHECK
PQTree.prototype.templateQ3 = function(x) {
	//todo
};

//OTHER FUNCTIONS
function createNodeAndCopyFullChildren(fullNodes) {
	var newNode = 0;
	if(fullNodes.length() == 1) {
		newNode = fullNodes.shift();
		removeChildFromSiblings(newNode);
	}
	else {
		newNode = new pq_node();

	}
};

function removeChildFromSiblings(node){

};