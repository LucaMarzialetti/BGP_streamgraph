var PQNodeMark = {
	UNMARKED : 0,
	QUEUED : 1,
	BLOCKED : 2,
	UNBLOCKED : 3
};

var PQNodeStatus = {
	EMPTY : 1,
	PARTIAL : 2,
	FULL : 3,
	PERTINENT : 4,
	TO_BE_DELETED : 5, 
	INDICATOR : 6,
	ELIMINATED : 6,
	WHA_DELETE : 7,
	PERTROOT : 8 
};

var PQNodeType = {
	PNode : 1,
	QNode : 2,
	Leaf : 3
};

var SibDirection = {
	NODIR : "NODIR",
	LEFT : "LEFT",
	RIGHT : "RIGHT"
};

// SPOSTATE IN NODE ROOT