class PQNode extends PQNodeRoot {
	constructor(object){
		if(object.count){
			if(object.infoPter){
				this.m_pointerToInfo = infoPtr;
				infoPtr.setNodePointer(this);
			}
			else{
				this.m_pointerToInfo = 0;
			}
			this.m_identificationNumber = object.count;
			this.m_childCount = 0;
			this.m_pertChildCount = 0;
			this.m_pertLeafCount = 0;
			this.m_debugTreeNumber = 0;
			this.m_parentType = 0;

			this.m_parent = 0;
			this.m_firstFull = 0;
			this.m_sibLeft = 0;
			this.m_sibRight = 0;
			this.m_referenceChild = 0;
			this.m_referenceParent = 0;
			this.m_leftEndmost = 0;
			this.m_rightEndmost = 0;

			this.fullChildren = [];
			this.partialChildren = [];
		}
	};

	getMark() {};

	setMark(mark) {};

	getStatus() {};

	setStatus(status) {};

	getType() {};

	setType(type) {};

	getInternal() {};

	setInternal(pointerToInternal) {};
		
	getKey() {};
	
	setKey(pointerToKey) {};

	referenceChild() { return this.m_referenceChild; };

	referenceParent() { return this.m_referenceParent; };

	setNodeInfo(pointerToInfo) {
		this.m_pointerToInfo = pointerToInfo;
		if(pointerToInfo != 0){
			this.m_pointerToInfo.setNodePointer(this);
			return true;
		}
		else
			return false;
	};

	putSibling(newSib, preference) {
		if(!preference){
			if (this.m_sibLeft == 0) {
				this.m_sibLeft = newSib;
				return PQNodeRoot.SibDirection.LEFT;
			}
			this.m_sibRight = newSib;
			return PQNodeRoot.SibDirection.RIGHT;
		}
		else
		if(preference == PQNodeRoot.SibDirection.LEFT)
			return putSibling(newSib);
		if(this.m_sibRight == 0){
			this.m_sibRight = newSib;
			return PQNodeRoot.SibDirection.RIGHT;
		}
		this.m_sibLeft = newSib;
		return PQNodeRoot.SibDirection.LEFT;
	};

	getPertChildCount(){ return this.m_pertChildCount;};
	setPertChildCount(count){this.m_pertChildCount=count;};

	getParentType(){ return this.m_parentType;};
	setParentType(parent){this.m_parentType=parent;};

	getParent(){ return this.m_parent;};
	setParent(parent){this.parent=parent;};

	getChildCount(){ return this.m_childCount;};
	setChildCount(count){this.m_childCount=count;};

	getIdentificationNumber(){return this.m_identificationNumber;};

	getNextSib(other) {
		if(this.m_sibLeft != other)
			return this.m_sibLeft;
		else 
		if (this.m_sibRight != other)
			return m_sibRight;
		return 0;
	};

	getSib(side) {
		if(side == PQNodeRoot.SibDirection.LEFT)
			return this.m_sibLeft;
		else 
		if (side == PQNodeRoot.SibDirection.RIGHT)
			return this.m_sibRight;
		return 0;
	};

	getNodeInfo() { return this.m_pointerToInfo; };

	getEndmost(object) {
		if(typeof object == "number"){
			if(side == PQNodeRoot.SibDirection.LEFT || side == 0)
				return this.m_leftEndmost;
			else
			if(side ==  PQNodeRoot.SibDirection.RIGHT)
				return this.m_rightEndmost;
		}
		else
		if(typeof object == "object"){
			if(this.m_leftEndmost != other)
				return this.m_leftEndmost;
			else
			if(this.m_rightEndmost != other)
				return this.m_rightEndmost;
		}
		return 0;
	};

	endmostChild() {return (this.m_sibLeft == 0 || this.m_sibRight == 0)};

	changeSiblings(oldSib, newSib) {
		if(this.m_sibLeft == oldSib){
			this.m_sibLeft = newSib;
			return true;
		}
		else
		if(this.m_sibRight == oldSib) {
			this.m_sibRight = newSib;
			return true;
		}
		return false;
	};

	changeEndmost(oldEnd, newEnd) {
		if(this.m_leftEndmost == oldEnd) {
			this.m_leftEndmost = newEnd;
			return true;
		}
		else 
		if(this.m_rightEndmost == oldEnd) {
			this.m_rightEndmost = newEnd;
			return true;
		}
		return false;
	};

}