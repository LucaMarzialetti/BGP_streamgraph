function MetricsManager() {
}

MetricsManager.prototype.metrics = function(current_parsed, asn_ordering){
	var line_std_devs = Object.values(this.lineDistancesStdDev(current_parsed, asn_ordering));
	var wiggles = this.computeWiggle(current_parsed,asn_ordering);
	var wiggles_sum = this.sortByWiggleMinSum(wiggles,asn_ordering);
	var wiggles_max = this.sortByWiggleMinMax(wiggles, asn_ordering);
	var disconnections = this.disconnections(current_parsed,asn_ordering);
	console.log("Line_Stanard_Deviation_Score ["+(this.lineDistanceStdDevScore(line_std_devs)).toFixed(1)+"]");
	console.log("Wiggle_sum_score ["+(this.wiggleScore(wiggles_sum)).toFixed(1)+"]");
	console.log("Wiggle_max_score ["+(this.wiggleScore(wiggles_max)).toFixed(1)+"]");
	console.log("Disconnections_Score ["+this.disconnectionsScore(disconnections)+"]");
}

/************************ DISCONNECTIONS ************************/
MetricsManager.prototype.disconnections = function(current_parsed, asn_ordering){
	//values store the cumulates in every instant for every ASN
	var values = [];
	for(var e in current_parsed.asn_distributions)
		values.push({});
	for(var e in current_parsed.asn_distributions){
		var dist = current_parsed.asn_distributions[e];
		for(var a=0; a<asn_ordering.length; a++){
			var current_as = asn_ordering[a];
			var current_value = dist[current_as];
			if(current_value>0){
				var level = asn_ordering.slice(0,a);
				for(var l in level){
					current_value+=dist[level[l]];
				}
				values[e][current_as]=current_value;
			}
			else
				values[e][current_as]=0;
		}
	}
	//fragments
	var disconnections={};
	for(var a in asn_ordering){
		disconnections[asn_ordering[a]]=0;
	}
	for(var a=1; a<asn_ordering.length; a++)
	for(var v=1; v<values.length; v++){
		if(values[v][asn_ordering[a]]>0 && values[v-1][asn_ordering[a]]>0){
			//previous minimum more than next maximum
			if(values[v-1][asn_ordering[a-1]]>=values[v][asn_ordering[a]]){
				disconnections[asn_ordering[a]]+=1//(values[v-1][asn_ordering[a-1]]-values[v][asn_ordering[a]]);
			}
			else 
			//previous maximum less than next minimum
			if(values[v][asn_ordering[a-1]]>=values[v-1][asn_ordering[a]]){
				disconnections[asn_ordering[a]]+=1;
			}
		}
	}
	return disconnections;
}

MetricsManager.prototype.disconnectionsScore = function(disconnections){
	var disc = 0 ;
	for(var d in disconnections)
		disc+=disconnections[d];
	return disc;
}


/************************ BORDER LINES STANDARD DEVIATION ************************/
MetricsManager.prototype.lineDistances = function(asn_distributions, asn_ordering){
	var distances=[];
	for(var i=0; i<asn_distributions.length-1;i++){
		distances[i]=[];
	}
	for(var i=0; i<distances.length; i++){
		var stato=asn_distributions[i];
		var under=0;
		for(var j in asn_ordering) {
			var a = asn_ordering[j];
			distances[i].push(parseFloat((stato[a]+under).toFixed(3)));
			under+=stato[a];
		}
	}
	return distances;
}

MetricsManager.prototype.lineDistancesStdDev = function(current_parsed, asn_ordering){
	var distances = this.lineDistances(current_parsed.asn_distributions,asn_ordering);
	var std_devs = {};
	for(var i in asn_ordering)
		std_devs[asn_ordering[i]]=[];
	for(var i in distances){
		var stato=distances[i];
		for(var j in asn_ordering){
			var asn = asn_ordering[j];
			std_devs[asn].push(stato[j]);
		}
	}
	for(var i in std_devs)
		std_devs[i]=std_dev(std_devs[i]);
	return std_devs;
}

MetricsManager.prototype.lineDistanceStdDevScore = function(line_distance){
	var distance = 0;
	for(var i in line_distance)
		distance+=line_distance[i];
	return distance;
}

/************************ WIGGLES ************************/
MetricsManager.prototype.sortByWiggleMinMax = function(wiggles, ordering){
	var as_w = {};
	for(var a in ordering)
		as_w[ordering[a]]=[];
	for(var w in wiggles){
		var list = wiggles[w];
		for(var a in list)
			as_w[a].push(list[a]);
	}

	for(var w in as_w){
		as_w[w]=max(as_w[w]);
	}

	return as_w;
}

MetricsManager.prototype.sortByWiggleMinSum = function(wiggles, ordering){
	var as_w = {};
	for(var a in ordering)
		as_w[ordering[a]]=[];
	for(var w in wiggles){
		var list = wiggles[w];
		for(var a in list)
			as_w[a].push(list[a]);
	}

	for(var w in as_w){
		as_w[w]=cumulate(as_w[w]);
	}

	return as_w;
}

MetricsManager.prototype.wiggleScore = function(wiggles){
	var w = 0;
	for(var i in wiggles){
		w+=wiggles[i];
	}
	return w;
}

MetricsManager.prototype.computeWiggle = function(current_parsed, asn_ordering){
	var wiggles = [];
	for(var e=1; e<current_parsed.asn_distributions.length; e++)
		wiggles.push({});

	for(var a=0 ;a<asn_ordering.length; a++){
		var as = asn_ordering[a];
		for(var e=1; e<current_parsed.asn_distributions.length; e++){

			var fi = current_parsed.asn_distributions[e][as];

			var xi = moment(current_parsed.events[e]).unix();
			var xi_1 = moment(current_parsed.events[(e-1)]).unix();

			var yi = calc_y(e,a,asn_ordering,current_parsed.asn_distributions);
			var yi_1 = calc_y((e-1),a,asn_ordering,current_parsed.asn_distributions);

			var yi1 = calc_y(e,(a-1),asn_ordering,current_parsed.asn_distributions);
			var yi1_1 = calc_y((e-1),(a-1),asn_ordering,current_parsed.asn_distributions);

			var g = calc_g(yi, yi_1, xi, xi_1);
			var g_1 = calc_g(yi1, yi1_1, xi, xi_1);
			
			var w = calc_w(fi,g,g_1);
		
			if(isNaN(w)){
				console.log("Wiggle IS NAN!"+xi+" "+xi_1+" "+yi+" "+yi_1+" "+yi1+" "+yi1_1);
				w=0;
			}
			wiggles[(e-1)][as]=w;
		}
	}
	return wiggles;

	function calc_y(e,a,ordering,asn_distributions){
		var dist = asn_distributions[e];
		var y = 0;
		if(a>=0)
			for(var i=0; i<=a; i++)
				y+=dist[ordering[i]];
		return y;
	}

	function calc_g(y0,y1,x0,x1){
		return (y0-y1)/(x0-x1);
	}

	function calc_w(fi, g, g_1){
		return fi*(Math.abs(g)+Math.abs(g_1))/2;
	}
}

/************************ LEVENSTHEIN ************************/
/* compute the levensthein matrix */
MetricsManager.prototype.characterization = function(asn_distributions, asn_ordering){
	var counters = [];
	var mapping = {};
	/*init*/
	for(var a=0; a<asn_ordering.length; a++)
		mapping[asn_ordering[a]]=String.fromCharCode(35+a);
	for(var i=0; i<asn_distributions.length;i++)
		counters[i]="";
	/*fit*/
	for(var i=0; i<asn_distributions.length;i++){
		var stato = asn_distributions[i];
		for(var s in asn_ordering){
			var valore = Math.round(stato[asn_ordering[s]]);
			for(var v=0; v<valore; v++)
				counters[i]+=mapping[asn_ordering[s]];
		}
	}
	return counters;
}

MetricsManager.prototype.computeLevenshteinDistance = function(current_parsed, asn_ordering){
	var strings = this.characterization(current_parsed.asn_distributions, asn_ordering);
	var distances = [];
	for(var i=0; i<strings.length-1; i++)
		distances.push(levenshtein(strings[i],strings[i+1]));
	return distances;
}


/************************ OTHER ************************/
/**freq difference**/
/* compute the difference vector (N-1) length by each sample (column) */
RipeDataParser.prototype.computeDifferenceVector = function(current_parsed){
	var counters = [];
	for(var i=0; i<current_parsed.events.length-1;i++)
		counters[i]=0;
	for(var i=0; i<counters.length; i++)
	for(var k in current_parsed.asn_freqs) {
		counters[i]+=Math.abs(current_parsed.asn_freqs[k][i]-current_parsed.asn_freqs[k][i+1]);
	}
	//counters è un array della differenza tra ogni campione considerando le frequenze
	return counters;
}

/**freq distance**/
/* compute the distance vector (N-1) length by each sample (column) */
RipeDataParser.prototype.computeDistanceVector = function(current_parsed){
	var counters = [];
	for(var i=0; i<current_parsed.events.length-1;i++)
		counters[i]=0;
	for(var i=0; i<counters.length; i++)
	for(var k in current_parsed.asn_freqs) {
		counters[i]+=Math.sqrt(Math.abs(Math.pow(current_parsed.asn_freqs[k][i],2)-Math.pow(current_parsed.asn_freqs[k][i+1],2)));
	}
	//counters è un array delle distanza tra ogni campione considerando le frequenze
	return counters;
}