define([
], function(d3){

	var GDBS = function(){
		this.perm_list = [];	//permutations
		this.seq = [];			//elements of the sequence
		this.binds = [];
	};

	GDBS.prototype.init = function(seq) {
		this.seq = seq.slice(0);
		this.perm_list = [];
		this.binds = [];
		for(var i in this.seq){
			this.perm_list.push(this.seq[i]);
		}
	};

	GDBS.prototype.consecutive = function(x,y){
		console.log("Consecutive "+x+" "+y+" from ")
		console.log(this.perm_list.slice(0));
		var cons = false;
		//CHECK IF THEY ARE ALREADY CONSECUTIVE IN THE SAME SUB-SEQUENCE
		for(var p = 0; p<this.perm_list.length && !cons; p++){
			var s = this.perm_list[p];
			if(Array.isArray(s)){
				var i = s.indexOf(x);
				var j = s.indexOf(y);
				if(i >= 0 && j >= 0 && Math.abs(i-j) == 1){
					cons = true;
					console.log("Already consecutive");
				}
			}
		}
		//IF NOT ALREADY CONSECUTIVE 
		//CHECK IF THEY ARE ON EXTREMIS OF DIFFERENT SUB-SEQUENCES OR IN SINGLE SUB-SEQUENCE
		if(!cons){
			var x_done = false;
			var y_done = false;
			var seq_x = -1;
			var seq_y = -1;
			var x_i = -1;
			var y_i = -1;
			var cur_index = -1;
			//iterate all sub-sequences
			for(var i = 0; i<this.perm_list.length && !(x_done&&y_done); i++){
				var s = this.perm_list[i];
				//if the sub-sequence is an array check for x or y position
				if(Array.isArray(s)){
					if(!x_done) {
						cur_index= s.indexOf(x);
						if(cur_index == 0 || cur_index == s.length-1){
							console.log("X in a sub-sequence");
							seq_x = i;
							x_i = cur_index;
							x_done = true;
						}
					}
					if(!y_done) {
						cur_index = s.indexOf(y);
						if(cur_index == 0 || cur_index == s.length-1){
							console.log("Y in a sub-sequence");
							seq_y = i;
							y_i = cur_index;
							y_done = true;
						}
					}
				}
				//if the sub-sequence is a single element check is x or y
				else {
					if(s == x && !x_done){
						console.log("X is single");
						seq_x = -1;
						x_i = i;
						x_done = true;
					}
					if(s == y && !y_done){
						console.log("Y is single");
						seq_y = -1;
						y_i = i;
						y_done = true;
					}
				}
			}
			console.log("x_done "+x_done+", y_done "+y_done);
			console.log(seq_x+" "+x_i+" | "+seq_y+" "+y_i);
			//CHECK THE FOUND INDEXES
			//if both are found and are not in the same sub-sequence
			if(x_done && y_done && !(seq_x != -1&&seq_y != -1&&seq_x == seq_y)){
				//UPDATE
				console.log("Consecutive by Update");
				var node;
				cons = true;
				//CASE: BOTH SINGLES (use reverse and splice to try order preservation)
				if(seq_x == -1&&seq_y == -1){
					console.log("Case 1");
					node = [];
					if(x_i > y_i){
						node.push(this.perm_list.splice(x_i,1)[0]);
						node.push(this.perm_list.splice(y_i,1)[0]);
						//node.reverse();
						console.log("nodo "+node)
						this.perm_list.splice(y_i,0,node);
					}
					else {
						node.push(this.perm_list.splice(y_i,1)[0]);
						node.push(this.perm_list.splice(x_i,1)[0]);
						//node.reverse();
						console.log("nodo")
						console.log(node)
						this.perm_list.splice(x_i,0,node);
					}
				}
				else
				//CASE: X IS THE SINGLE, Y IS A SUB-SEQUENCE
				if(seq_x == -1&&seq_y != -1){
					console.log("Case 2");
					//remove X
					node = this.perm_list.splice(x_i,1)[0];
					console.log("nodo "+node)
					if(x_i<seq_y)
						seq_y--;
					//if Y is on head
					if(y_i == 0){
						this.perm_list[seq_y].unshift(node);
					}
					//if Y is on tail
					else{
						this.perm_list[seq_y].push(node);
					}
				}
				else
				//CASE: Y IS THE SINGLE, X IS A SUB-SEQUENCE
				if(seq_y == -1 && seq_x != -1){
					console.log("Case 3");
					//remove Y
					node = this.perm_list.splice(y_i,1)[0];
					console.log("nodo "+node)
					if(y_i < seq_x)
						seq_x--;
					//if X is on head
					if(x_i == 0){
						this.perm_list[seq_x].unshift(node);
					}
					//if X is on tail
					else{
						this.perm_list[seq_x].push(node);
					}
				}
				//CASE: X AND Y ARE SUB-SEQUENCES
				else{
					console.log("Case 4");
					//not both in head or tail
					if(y_i != x_i){
						//X is head => push in tail of Y
						if(x_i == 0) {
							console.log("- X head , Y tail");
							node = this.perm_list.splice(seq_x,1)[0];
							if(seq_x<seq_y)
								seq_y--;
							console.log("nodo "+node)
							for(var n in node)
								this.perm_list[seq_y].push(node[n]);
						}
						//Y is head => push in tail of X
						else 
						if(y_i == 0)	{
							console.log("- Y head , X tail");
							node = this.perm_list.splice(seq_y,1)[0];
							if(seq_y<seq_x)
								seq_x--;
							console.log("nodo "+node)
							for(var n in node)
								this.perm_list[seq_x].push(node[n]);
						}
					}
					//both head or tail => push X into Y
					else {
						node = this.perm_list.splice(seq_x,1)[0];
						console.log("nodo "+node)
						if(seq_x<seq_y)
							seq_y--;
						//from head
						if(x_i == y_i == 0){
							console.log("- X,Y head");
							for(var n in node)
								this.perm_list[seq_y].unshift(node[n]);
						}
						//from tail
						else {
							console.log("- X,Y tail");
							for(var n = node.length-1; n >= 0; n--)
								this.perm_list[seq_y].push(node[n]);
						}
					}
				}
			}
		}
		if(!cons){
			console.log("Cant' Be Consecutive");
		}
		return cons;
	};

	GDBS.prototype.show = function(){
		var shown = [];
		for(var n in this.perm_list) {
			var node = this.perm_list[n];
			if(Array.isArray(node)){
				for(var i in node)
					shown.push(node[i]);
			}
			else
				shown.push(node);
		}
		return shown;
	};

	GDBS.prototype.getStructure = function(){
		return this.perm_list;
	};

	return GDBS;
});