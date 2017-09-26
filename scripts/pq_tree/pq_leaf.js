class PQLeaf extends PQNode{
	constructor(object){
		if(object.count && object.typ && object.stat && object.keyPtr){
			if(object.infoPtr)
				super(object.count, object.infoPtr);
			else
				super(object.count);
			this.m_pointerToKey = keyPtr;
			keyPtr.setNodePointer(this);
			this.m_mark=PQNodeRoot.PQNodeMark.UNMARKED;
			this.m_status=object.stat;
			this.m_type=object.typ;
		}
	};

	getKey() { return this.m_pointerToKey; };

	setKey(pointerToKey){
		this.m_pointerToKey = pointerToKey;
		if (pointerToKey != 0){
 			this.m_pointerToKey.setNodePointer(this);
			return true;
		}
		else
			return false;
	};

	getInternal() { return 0; };

	setInternal(pointerToInternal){
		if (pointerToInternal != 0)
			return false;
		else
			return true;
	};

	getMark() { return this.m_mark; };

	aetMark(mark) { this.m_mark = mark; };

	getStatus() { return this.m_status; };

	setStatus(status) { this.m_status = status; };

	getType() { return PQNodeRoot.PQNodeType.Leaf; };

	setType(type) { this.m_type = type; };
}