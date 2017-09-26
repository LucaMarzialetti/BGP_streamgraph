class PQInternalKey extends PQBasicKey {
	constructor(element){
		super();
		this.m_userStructInternal = element;
	};

	userStructKey() { return 0; };
	userStructInfo() { return 0; };
	userStructInternal() { return this.m_userStructInternal; };
}