class PQNodeKey extends PQBasicKey {
	constructor(info){
		super();
		this.m_userStructInfo=info;
	};
	userStructKey() { return 0; };
	userStructInfo() { return this.m_userStructInfo; };
	userStructInternal() { return 0; };
}