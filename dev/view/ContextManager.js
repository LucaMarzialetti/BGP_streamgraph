define([
	"bgpst.view.graphdrawer",
	"bgpst.view.gui"
], function(GraphDrawer, GuiManager){

	var ContextManager = function() {
		console.log("= Context Manager Starting");
		this.drawer = new GraphDrawer();
		this.GuiManager = new GuiManager(this.drawer, this);
		this.drawer.GuiManager = this.GuiManager;
		console.log("= ContextManager Ready");
	};

	ContextManager.prototype.storeContext = function(data,name) {
		if(this.GuiManager.localstorage_enabled)
			try {
				localStorage[name] = JSON.stringify(data);
			}
			catch(err){
				alert("Local storage exhausted.\nThe data will not be cached ("+name+")	");
			}
	};

	ContextManager.prototype.restoreContext = function() {
		var original_data = JSON.parse(localStorage['last_context_original_data']);
		var peerings = JSON.parse(localStorage['last_context_peerings']);
		var starttime = localStorage['last_context_starttime'].replace(/"/g,'');;
		var endtime = localStorage['last_context_endtime'].replace(/"/g,'');;
		var targets = localStorage['last_context_targets'].replace(/"/g,'');
		
		this.GuiManager.RipeDataBroker.current_starttime = starttime;
		this.GuiManager.RipeDataBroker.current_endtime = endtime;
		this.GuiManager.RipeDataBroker.current_targets = targets;
		this.GuiManager.RipeDataBroker.ipv4_peerings = peerings[4];
		this.GuiManager.RipeDataBroker.ipv6_peerings = peerings[6];
		this.GuiManager.RipeDataBroker.current_parsed = original_data;
		this.GuiManager.RipeDataBroker.loadCurrentState(null,false,null,true);
	};

	ContextManager.prototype.getLocalParameters = function() {
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++) {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	};

	ContextManager.prototype.check_request = function(){
		var DateConverter = this.GuiManager.DateConverter;
		var validator = this.GuiManager.validator;
		var params = this.getLocalParameters();
		var start = params["w.starttime"];
		var end = params["w.endtime"];
		var tgt = params["w.resources"];
		var type = params["w.type"];
		var level = params["w.level"];
		var prepending = params["w.prepending"];
		var merge_cp = params["w.merge_cp"];
		var merge_events = params["w.merge_events"];
		var timemap = params["w.timemap"];
		var global_vis = params["w.global"];
		var colors = params['w.colors'];
		var info = params["w.info"];
		var brush_s = params["w.brush_s"];
		var brush_e = params["w.brush_e"];
		var heuristic = params["w.heu"];
		var heuristic_sort_type = params["w.sort_type"];
		var request_done = false;
		if(start&&end&&tgt){
			tgt = tgt.replace(/#$/,"");
			try{
				//dates
				start = DateConverter.formatRipe(DateConverter.parseRipe(start));
				end = DateConverter.formatRipe(DateConverter.parseRipe(end));
				if(GuiManager.validator.check_date_with_format(start,GuiManager.DateConverter.ripestat_data_format)&&GuiManager.validator.check_date_with_format(end,GuiManager.DateConverter.ripestat_data_format)){
					this.GuiManager.RipeDataBroker.current_starttime = start;
					this.GuiManager.RipeDataBroker.current_endtime = end;
				}
				else{
					throw "wrong dates";
					request_done = false;
				}
				//targets
				var tgt_list = tgt.split(',');
				if(tgt_list.every(function(e){return validator.check_ipv4(e)||validator.check_ipv6(e)||validator.check_asn(e);}))
					this.GuiManager.RipeDataBroker.current_targets = tgt;
				else{
					throw "wrong target";
					request_done = false;
				}
				//type
				if(type)
				if(type == "stream"||type == "heat")
					this.GuiManager.graph_type = type;
				//level
				if(level){
					level = parseInt(level);
					if(!isNaN(level))
						this.GuiManager.asn_level = level;
				}
				//merge cp
				if(merge_cp)
				if(merge_cp == 'true'|| merge_cp == 'false')
					this.GuiManager.merge_cp = merge_cp == 'true';
				//merge events
				if(merge_events){
					merge_events = parseInt(merge_events);
					if(!isNaN(merge_events))
						this.GuiManager.merge_events = merge_events;
				}
				//timemap
				if(timemap)
				if(timemap == 'true'|| timemap == 'false')
					this.GuiManager.heatmap_time_map = timemap == 'true';
				//global visibility
				if(global_vis)
				if(global_vis == 'true'|| global_vis == 'false')
					this.GuiManager.global_visibility = global_vis == 'true';
				//gather info
				if(info)
				if(info == 'true'|| info == 'false')
					this.GuiManager.gather_information = info == 'true';
				//preserve colors
				if(colors)
				if(colors == 'true'|| colors == 'false')
					this.GuiManager.gather_information = colors == 'true';
				//gather info
				if(info)
				if(info == 'true'|| info == 'false')
					this.GuiManager.gather_information = info == 'true';
				//brusher
				brush_s = DateConverter.formatRipe(DateConverter.parseRipe(brush_s));
				brush_e = DateConverter.formatRipe(DateConverter.parseRipe(brush_e));
				if(GuiManager.validator.check_date_with_format(brush_s,GuiManager.DateConverter.ripestat_data_format)&&GuiManager.validator.check_date_with_format(brush_e,GuiManager.DateConverter.ripestat_data_format)){
					this.GuiManager.drawer.events_range = [];
					this.GuiManager.drawer.events_range[0] = moment(brush_s);
					this.GuiManager.drawer.events_range[1] = moment(brush_e);
				}
				//heuristic
				if(heuristic)
					this.GuiManager.RipeDataBroker.HeuristicsManager.current_heuristic = heuristic;
				//sort_type
				if(heuristic_sort_type)
					this.GuiManager.RipeDataBroker.HeuristicsManager.current_sort_type = heuristic_sort_type;
				this.GuiManager.RipeDataBroker.getData();
				request_done = true;
			}
			catch(e){
				alert(e);
				this.GuiManager.RipeDataBroker.current_starttime = null;
				this.GuiManager.RipeDataBroker.current_endtime = null;
				this.GuiManager.RipeDataBroker.current_targets = null;
			}
		}
		return request_done;
	};

	return ContextManager;
});