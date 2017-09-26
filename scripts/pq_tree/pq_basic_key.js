class PQBasicKey extends PQBasicKeyRoot{
	constructor(){
		super();
		this.m_nodePointer = new PQNode(0); //dubbio <---
	}

	userStructKey() {};
	userStructInfo() {};
	userStructInternal() {};

	nodePointer(){
		return this.m_nodePointer;
	};

	setNodePointer(node){
		this.m_nodePointer = node;
	};
}