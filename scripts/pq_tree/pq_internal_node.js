class PQInternalNode extends PQNode {
	
	constructor(object){
		if(object.count && object.typ && object.stat){
			if(object.infoPtr)
				super(object.count, object.infoPtr);
			else
				super(object.count);
			if(object.internalPtr){
				this.m_pointerToInternal=object.internalPtr;
				internalPtr.setNodePointer(this);
			}
			else
				this.m_pointerToInternal=0;
			this.m_mark=PQNodeRoot.PQNodeMark.UNMARKED;
			this.m_status=object.stat;
			this.m_type=object.typ;
		}
	};

	getKey() { return 0; };

	setKey(pointerToKey) {
  		return (pointerToKey == 0);
	};

	getInternal() { return this.m_pointerToInternal; };

	setInternal(pointerToInternal) {
		this.m_pointerToInternal = pointerToInternal;
		if (pointerToInternal != 0){
			this.m_pointerToInternal.setNodePointer(this);
			return true;
		}
		else
			return false;
	};

	getMark() { return this.m_mark; };

	setMark(mark) { this.m_mark = mark; };

	getStatus() { return this.m_status; };

	setStatus(status) { this.m_status = status; };

	getType() { return this.m_type; };

	setType(type) { this.m_type = type; };
}