class PQTree {
	constructor(){
		this.m_root = 0;
		this.m_pertinentRoot = 0;
		this.m_pseudoRoot = 0;
		this.m_numberOfLeaves = 0;
		this.m_identificationNumber = 0;
		this.m_pertinentNodes = 0;
	};

	root(){return this.m_root;};


	fullChildren(nodePtr) {
		return nodePtr.fullChildren;
	};

	partialChildren(nodePtr) {
		return nodePtr.partialChildren;
	};

	clientLeftEndmost(nodePtr) {
		return nodePtr.m_leftEndmost;
	};

	clientRightEndmost(nodePtr) {
		return nodePtr.m_rightEndmost;
	};

	clientNextSib(nodePtr, other){
		return nodePtr.getNextSib(other);
	};

	clientSibLeft(nodePtr) {
		return nodePtr.m_sibLeft;
	};

	clientSibRight(nodePtr) {
		return nodePtr.m_sibRight;
	};

	addNewLeavesToTree(father, leafKeys){
		if(!leafKeys.length<1){
			
		}
	};
}