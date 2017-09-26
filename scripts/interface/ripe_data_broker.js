function RipeDataBroker(drawer, context, gui_manager) {
	console.log("=== RipeBroker Starting");
	this.drawer = drawer;
	this.context = context;
	this.gui_manager = gui_manager;
	this.current_utc = moment().utc();
	this.parser = new RipeDataParser();
	this.date_converter = new DateConverter();
	this.heuristics_manager = new HeuristicsManager(this.gui_manager.graph_type);
	this.current_parsed, this.current_asn_tsv, this.current_rrc_tsv, this.current_lev_distance;
	this.current_starttime, this.current_endtime, this.current_targets, this.current_visibility;
	this.ipv6_peerings=0, this.ipv4_peerings=0;
	console.log("=== RipeBroker Ready");
}

//format GET url for ripestat query
RipeDataBroker.prototype.requestBuilder = function(start_d,start_t,end_d,end_t,targets) {
	this.current_starttime = this.date_converter.formatRipeDateTime(this.date_converter.parseInterfaceDate(start_d), this.date_converter.parseInterfaceTime(start_t));
	this.current_endtime = this.date_converter.formatRipeDateTime(this.date_converter.parseInterfaceDate(end_d), this.date_converter.parseInterfaceTime(end_t));
	this.current_targets = "resource="+targets;
	var starttime="&starttime="+start_ts;
	var endtime="&endtime="+end_ts;
	var get_url = base_url+this.current_targets+starttime+endtime;
	return get_url;
}

//format GET url for ripestat query
RipeDataBroker.prototype.requestBuilderData = function(start_d,start_t,end_d,end_t,targets) {
	this.current_starttime = this.date_converter.formatRipeDateTime(start_d,start_t);
	this.current_endtime = this.date_converter.formatRipeDateTime(end_d,end_t);
	this.current_targets = targets;
}

//do the ajax get
RipeDataBroker.prototype.getData = function(start_d,end_d,targets) {
	var ripe_data_broker = this;
	if(start_d!=null)
		this.current_starttime=start_d;
	if(end_d!=null)
		this.current_endtime=end_d;
	if(targets!=null)
		this.current_targets=targets;
	//https://stat.ripe.net/data/bgplay/data.json?resource=140.78/16&starttime=2012-12-21T07:00&endtime=2012-12-21T12:00
	var url_ris_peer_count = "https://stat.ripe.net/data/ris-peer-count/data.json";
	$.ajax({
		url: url_ris_peer_count,
		dataType: "json",
		//unix_timestamps: true,
		data : {
			starttime: ripe_data_broker.date_converter.formatRipe(moment(this.current_starttime).subtract(1,"months")),
			endtime: ripe_data_broker.date_converter.formatRipe(moment(this.current_endtime).add(1,"months"))
		},
		success: function(data){
			console.log("=== RipeBroker Success! Peer count loaded");
			console.log(data);
			try {
				ripe_data_broker.ipv4_peerings=max(data['data']['peer_count']['v4']['full_feed'].map(function(e){return e['count'];}));
				ripe_data_broker.ipv6_peerings=max(data['data']['peer_count']['v6']['full_feed'].map(function(e){return e['count'];}));
				// if(ripe_data_broker.ipv4_peerings==0)
				// 	ripe_data_broker.ipv4_peerings=max(data['data']['peer_count']['v4']['total'].map(function(e){return e['count'];}));
				// if(ripe_data_broker.ipv6_peerings==0)
				// 	ripe_data_broker.ipv6_peerings=max(data['data']['peer_count']['v6']['total'].map(function(e){return e['count'];}));
				if(ripe_data_broker.ipv6_peerings==0 && targets.split(",").some(function(e){return ripe_data_broker.gui_manager.validator.check_ipv6(e)}))
					ripe_data_broker.gui_manager.global_visibility=false;
				if(ripe_data_broker.ipv4_peerings==0 && targets.split(",").some(function(e){return ripe_data_broker.gui_manager.validator.check_ipv4(e)}))
					ripe_data_broker.gui_manager.global_visibility=false;
				ripe_data_broker.context.storeContext({4:ripe_data_broker.ipv4_peerings, 6:ripe_data_broker.ipv6_peerings},"last_context_peerings");
			}
			catch(err) {
				console.log("=== RipeBroker Warning: empty peerings size");
				ripe_data_broker.ipv6_peerings=0;
				ripe_data_broker.ipv4_peerings=0;
				ripe_data_broker.gui_manager.global_visibility=false;
			}
			ripe_data_broker.getBGPData();
		},
		fail: function (argument) {
			alert("Server error");
		}
	});
}

RipeDataBroker.prototype.getBGPData = function() {
	var url_bgplay = "https://stat.ripe.net/data/bgplay/data.json";
	var ripe_data_broker = this;
	$.ajax({
		url: url_bgplay,
		dataType: "json",
		unix_timestamps: true,
		data : {
			resource: this.current_targets,
			starttime: this.current_starttime,
			endtime: this.current_endtime
		},
		success: function(data){
			console.log("=== RipeBroker Success! Data loaded from:"+url_bgplay);
			console.log(data);
			ripe_data_broker.gui_manager.changeLoaderText("Parsing Obtained Data...");
			try {
				ripe_data_broker.current_parsed = ripe_data_broker.parser.ripe_response_parse(data, ripe_data_broker.current_starttime, ripe_data_broker.current_endtime);
				if(ripe_data_broker.gui_manager.gather_information){
					console.log("=== RipeBroker Starting gathering RRC Info");
					ripe_data_broker.gui_manager.rrc_info_done=false;
					setTimeout(function(){
						ripe_data_broker.getRRCInfo(ripe_data_broker.current_parsed.resources,0)
					},0);
				}
				ripe_data_broker.context.storeContext(ripe_data_broker.current_starttime,"last_context_starttime");
				ripe_data_broker.context.storeContext(ripe_data_broker.current_endtime,"last_context_endtime");
				ripe_data_broker.current_targets = data.data.targets.map(function (e) {return e['prefix'].replace(/"/g,'');}).join(",");
				ripe_data_broker.context.storeContext(ripe_data_broker.current_targets,"last_context_targets");
				ripe_data_broker.loadCurrentState(true,ripe_data_broker.gui_manager.drawer.events_range,true);

				if(ripe_data_broker.gui_manager.gather_information){
					console.log("=== RipeBroker Starting gathering ASN Info");				
					setTimeout(function(){
						ripe_data_broker.gui_manager.asn_info_done=false;
						if(ripe_data_broker.gui_manager.graph_type=="stream")
							ripe_data_broker.getASNInfo(ripe_data_broker.current_parsed.asn_set,0);
						else
						if(ripe_data_broker.gui_manager.graph_type=="heat")
							ripe_data_broker.getASNInfo(ripe_data_broker.gui_manager.drawer.asn_set,0);
					},0);	
				}
			}
			catch(err){
				console.log(err);
				alert("No data found for this target in the interval of time selected");
			}
			finally {
				ripe_data_broker.gui_manager.draw_functions_btn_enabler();
				ripe_data_broker.gui_manager.toggleLoader();
			}
		},
		error: function(jqXHR, exception){
			ripe_data_broker.gui_manager.changeLoaderText("Uops, something went wrong");
			switch(jqXHR.status){
				case 500:
					alert("Server error");
				break;
				case 404:
					alert("Bad Request");
				break;
				default:
					alert("Something went wrong");
				break;
			}
			ripe_data_broker.gui_manager.toggleLoader();
		}
	});
	ripe_data_broker.gui_manager.changeLoaderText("Waiting for RIPEStat...");
}

RipeDataBroker.prototype.RRCInfoCallBack = function(res) {
	var url_rrc = "https://stat.ripe.net/data/geoloc/data.json?resource="+res.ip;
	var ripe_data_broker = this;
	$.ajax({
		url: url_rrc,
		dataType: "json",
		success: function(data){
			res["geo"]=data.data.locations[0].country;
			ripe_data_broker.current_parsed.known_rrc[res.id]=res;
		},
		error: function(jqXHR, exception){
			alert("failed RRC lookup for "+res);
		}
	});
}

RipeDataBroker.prototype.getRRCInfo = function(resources,index) {
	if(index<resources.length){
		var res = resources[index];
		var r_id = res.id;
		if(!this.current_parsed.known_rrc[r_id])
			this.RRCInfoCallBack(res);
		index++;
		this.getRRCInfo(resources, index);
	}
	else{
		this.gui_manager.rrc_info_done=true;
		console.log("=== RipeBroker RRCinfo Completed");
	}
}

RipeDataBroker.prototype.ASNInfoCallBack = function(res) {
	var url_asn = "https://stat.ripe.net/data/as-overview/data.json?resource=AS"+res;
	var ripe_data_broker = this;
	$.ajax({
		url: url_asn,
		dataType: "json",
		success: function(data){
			ripe_data_broker.current_parsed.known_asn[res]=data.data.holder;
		},
		error: function(jqXHR, exception){
			alert("failed ASN lookup for "+res);
		}
	});
}

RipeDataBroker.prototype.getASNInfo = function(resources,index) {
	if(index<resources.length){
		var res = resources[index]
		if(!this.current_parsed.known_asn[res] && !isNaN(parseInt(res)))
			this.ASNInfoCallBack(res);
		index++;
		this.getASNInfo(resources, index);
	}
	else{
		this.gui_manager.asn_info_done=true;
		console.log("=== RipeBroker ASNinfo Completed");
	}
}

RipeDataBroker.prototype.brush = function(events_range){
	this.loadCurrentState(null,events_range,false);
}

RipeDataBroker.prototype.loadCurrentState = function(store, events_range, redraw_minimap) {
	ripe_data_broker=this;
	this.gui_manager.changeLoaderText("Drawing the chart!");
	this.gui_manager.ip_version_checkbox_enabler();
	this.gui_manager.restoreQuery(this.current_starttime, this.current_endtime, this.current_targets);
	var ordering;
	if(this.gui_manager.gather_information){
		console.log("=== RipeBroker Starting gathering RRC Info");
		ripe_data_broker.gui_manager.rrc_info_done=false;
		setTimeout(function(){
			ripe_data_broker.getRRCInfo(ripe_data_broker.current_parsed.resources,0)
		},0);
		console.log("=== RipeBroker Starting gathering ASN Info");				
		setTimeout(function(){
			ripe_data_broker.gui_manager.asn_info_done=false;
			if(ripe_data_broker.gui_manager.graph_type=="stream")
				ripe_data_broker.getASNInfo(ripe_data_broker.current_parsed.asn_set,0);
			else
			if(ripe_data_broker.gui_manager.graph_type=="heat")
				ripe_data_broker.getASNInfo(ripe_data_broker.gui_manager.drawer.asn_set,0);
		},0);
	}
	/*COMMON*/
	this.current_asn_tsv = this.parser.convert_to_streamgraph_tsv(this.current_parsed, this.gui_manager.prepending_prevention, this.gui_manager.asn_level, this.gui_manager.ip_version);
	this.parser.states_rrc(this.current_parsed,this.gui_manager.asn_level,this.gui_manager.prepending_prevention);
	this.parser.rrc_composition(this.current_parsed);
	this.parser.rrc_seqs(this.current_parsed);
	this.parser.asn_exchanges(this.current_parsed);
	this.current_visibility = 0;
	if(this.gui_manager.global_visibility) {
		for(var t in this.current_parsed.targets){
			var tgs = this.current_parsed.targets[t];
			if(this.gui_manager.ip_version.indexOf(4)!=-1 && this.gui_manager.validator.check_ipv4(tgs)){
				console.log("== RipeBroker adding ipv4 peerings");
				this.current_visibility+=this.ipv4_peerings;
			}
			if(this.gui_manager.ip_version.indexOf(6)!=-1 && this.gui_manager.validator.check_ipv6(tgs)){
				console.log("== RipeBroker adding ipv6 peerings");
				this.current_visibility+=this.ipv6_peerings;
			}
		}
	}
	else
		this.current_visibility=this.current_parsed.local_visibility;
	//STREAM
	if(this.gui_manager.graph_type=="stream") {
		//ORDERING
		ordering=this.heuristics_manager.getCurrentOrdering(this.current_parsed, this.gui_manager.graph_type);
		if(!ordering)
			ordering=this.current_parsed.asn_set;
		this.gui_manager.update_counters(".counter_asn",this.current_parsed.asn_set.length);
		this.gui_manager.update_counters(".counter_events",this.current_parsed.events.length);
		this.drawer.draw_streamgraph(this.current_parsed, this.gui_manager.graph_type, this.current_asn_tsv, ordering, this.gui_manager.preserve_map, this.current_visibility, this.current_parsed.targets, this.current_parsed.query_id, function(pos){return ripe_data_broker.go_to_bgplay(ripe_data_broker.current_starttime,ripe_data_broker.current_endtime,ripe_data_broker.current_targets,pos)},null,events_range, redraw_minimap);
		this.heuristics_manager.metrics_manager.metrics(this.current_parsed, this.drawer.keys);
		this.gui_manager.isGraphPresent=d3.select("svg").select(".chart").node()!=null;
	}
	else 
	//HEAT
	if(this.gui_manager.graph_type=="heat") {
		this.current_rrc_tsv = this.parser.convert_to_heatmap_tsv(this.current_parsed, this.gui_manager.prepending_prevention, this.gui_manager.asn_level, this.gui_manager.ip_version);
		//ORDERING
		ordering=this.heuristics_manager.getCurrentOrdering(this.current_parsed, this.gui_manager.graph_type);
		if(!ordering){
			console.log("ordering non c'è")
			ordering=this.current_parsed.rrc_set;
		}
		else
			console.log("ordering c'è")
		this.drawer.draw_heatmap(this.current_parsed, this.current_rrc_tsv, this.current_asn_tsv, ordering, this.gui_manager.preserve_map, this.current_visibility, this.current_parsed.targets, this.current_parsed.query_id, function(pos){return ripe_data_broker.go_to_bgplay(ripe_data_broker.current_starttime,ripe_data_broker.current_endtime,ripe_data_broker.current_targets,pos)}, this.gui_manager.asn_level, this.gui_manager.ip_version, this.gui_manager.prepending_prevention, this.gui_manager.merge_rrc, this.gui_manager.merge_events, this.gui_manager.events_labels, this.gui_manager.rrc_labels, this.gui_manager.heatmap_time_map, events_range, redraw_minimap);
		if(this.gui_manager.merge_events)
			this.gui_manager.update_counters(".counter_events",this.gui_manager.drawer.event_set.length+"/"+this.current_parsed.events.length);
		else
			this.gui_manager.update_counters(".counter_events",this.current_parsed.events.length);

		if(this.gui_manager.merge_rrc)
			this.gui_manager.update_counters(".counter_asn", this.gui_manager.drawer.keys.length+"/"+this.current_parsed.rrc_set.length);
		else
			this.gui_manager.update_counters(".counter_asn", this.gui_manager.drawer.keys.length);
		this.gui_manager.isGraphPresent=d3.select("svg").select(".chart").node()!=null;
	}
	else {
		alert("nè heat nè stream, problema!");
		this.gui_manager.drawer.drawer_init();
		this.gui_manager.isGraphPresent=false;
	}
	if(store)
		this.context.storeContext(this.current_parsed,"last_context_original_data");
	//window.scrollTo(0,document.body.scrollHeight);
	this.gui_manager.boolean_checker();
	this.gui_manager.draw_last_data_btn_enabler();
	this.gui_manager.draw_functions_btn_enabler();
	this.gui_manager.url_string();
}

RipeDataBroker.prototype.go_to_bgplay = function(start,end,targets,pos){
	//https://stat.ripe.net/widget/bgplay#w.ignoreReannouncements=false&w.resource=93.35.170.87,23.1.0.0/24&w.starttime=1489313137&w.endtime=1489572337&w.rrcs=0,1,2,5,6,7,10,11,13,14,15,16,18,20&w.instant=null&w.type=bgp
	var url = "https://stat.ripe.net/widget/bgplay#";
	url+="w.resource="+targets;
	url+="&w.starttime="+start;
	url+="&w.endtime="+end;
	url+="&w.instant="+this.date_converter.formatUnix(pos);
	url+="&w.type=bgp";
	console.log("con utc"+moment(pos).utc().unix(pos));
	console.log("senza utc"+moment(pos).unix(pos));
	console.log("GO TO BGPLAY AT "+url);
	return window.open(url,'_blank');
}

RipeDataBroker.prototype.streamgraph_streaming = function(every) {
	ripe_data_broker=this;
	var interval_id = setInterval(function (){
		ripe_data_broker.gui_manager.toggleLoader();
		var date = moment(new Date());
		var formatted = ripe_data_broker.date_converter.formatRipe(date);
		ripe_data_broker.getData(ripe_data_broker.current_starttime, formatted, ripe_data_broker.current_targets);
		console.log("Streaming got new data!");
	}, every);
	console.log("Streaming started with interval ID: "+interval_id);
	return interval_id;
}

RipeDataBroker.prototype.streamgraph_stepped_view = function(every) {
	var ripe_data_broker = this;
	var max = this.current_asn_tsv.split("\n").length-1;
	var i=2;
	var interval_id = setInterval(function (){
		if(i>max){
			clearInterval(interval_id);
			console.log("Step view over");
			ripe_data_broker.gui_manager.steps=false;
			ripe_data_broker.gui_manager.draw_functions_btn_enabler();
		}
		else { 
			core(i);
			i+=1;
		}
	},every);
	console.log("Step view started with interval ID: "+interval_id);

	function core(i) {
		ripe_data_broker.drawer.draw_streamgraph(ripe_data_broker.current_parsed, ripe_data_broker.gui_manager.graph_type, ripe_data_broker.current_asn_tsv, ripe_data_broker.drawer.keys, ripe_data_broker.gui_manager.preserve_map, ripe_data_broker.current_visibility, ripe_data_broker.current_parsed.targets, ripe_data_broker.current_parsed.query_id, function(pos){return ripe_data_broker.go_to_bgplay(ripe_data_broker.current_starttime,ripe_data_broker.current_endtime,ripe_data_broker.current_targets,pos)},i,null,false);
		ripe_data_broker.gui_manager.update_counters(".counter_asn",ripe_data_broker.current_parsed.asn_set.length);
		ripe_data_broker.gui_manager.update_counters(".counter_events",i+"/"+max);
	}
}