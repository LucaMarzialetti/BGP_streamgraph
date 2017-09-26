class PQLeafKey extends PQBasicKey {
	constructor(element){
		super();
		this.m_userStructKey = element;
	};
	
	userStructInfo() { return 0; };
	userStructInternal() {return 0; };
	userStructKey() { return this.m_userStructKey; };
}