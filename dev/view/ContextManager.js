define([
  /*graph drawer*/
  /*gui manager*/
], function(d3){

	var ContextManager = function() {
		console.log("= Context Manager Starting");
		this.drawer = new GraphDrawer();
		this.gui_manager = new GuiManager(this.drawer, this);
		this.drawer.gui_manager=this.gui_manager;
		console.log("= ContextManager Ready");
	};

	ContextManager.prototype.storeContext = function(data,name) {
		if(this.gui_manager.localstorage_enabled)
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
		
		this.gui_manager.ripe_data_broker.current_starttime = starttime;
		this.gui_manager.ripe_data_broker.current_endtime = endtime;
		this.gui_manager.ripe_data_broker.current_targets = targets;
		this.gui_manager.ripe_data_broker.ipv4_peerings=peerings[4];
		this.gui_manager.ripe_data_broker.ipv6_peerings=peerings[6];
		this.gui_manager.ripe_data_broker.current_parsed = original_data;
		this.gui_manager.ripe_data_broker.loadCurrentState(null,false,null,true);
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
		var date_converter = this.gui_manager.date_converter;
		var validator = this.gui_manager.validator;
		var params = this.getLocalParameters();
		var start = params["w.starttime"];
		var end = params["w.endtime"];
		var tgt = params["w.resources"];
		var type = params["w.type"];
		var level = params["w.level"];
		var prepending = params["w.prepending"];
		var merge_rrc = params["w.merge_rrc"];
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
			tgt=tgt.replace(/#$/,"");
			try{
				//dates
				start=date_converter.formatRipe(date_converter.parseRipe(start));
				end=date_converter.formatRipe(date_converter.parseRipe(end));
				if(gui_manager.validator.check_date_with_format(start,gui_manager.date_converter.ripestat_data_format)&&gui_manager.validator.check_date_with_format(end,gui_manager.date_converter.ripestat_data_format)){
					this.gui_manager.ripe_data_broker.current_starttime=start;
					this.gui_manager.ripe_data_broker.current_endtime=end;
				}
				else{
					throw "wrong dates";
					request_done=false;
				}
				//targets
				var tgt_list = tgt.split(',');
				if(tgt_list.every(function(e){return validator.check_ipv4(e)||validator.check_ipv6(e)||validator.check_asn(e);}))
					this.gui_manager.ripe_data_broker.current_targets=tgt;
				else{
					throw "wrong target";
					request_done=false;
				}
				//type
				if(type)
				if(type=="stream"||type=="heat")
					this.gui_manager.graph_type=type;
				//level
				if(level){
					level = parseInt(level);
					if(!isNaN(level))
						this.gui_manager.asn_level=level;
				}
				//merge rrc
				if(merge_rrc)
				if(merge_rrc == 'true'|| merge_rrc == 'false')
					this.gui_manager.merge_rrc=merge_rrc=='true';
				//merge events
				if(merge_events){
					merge_events=parseInt(merge_events);
					if(!isNaN(merge_events))
						this.gui_manager.merge_events=merge_events;
				}
				//timemap
				if(timemap)
				if(timemap == 'true'|| timemap == 'false')
					this.gui_manager.heatmap_time_map=timemap=='true';
				//global visibility
				if(global_vis)
				if(global_vis == 'true'|| global_vis == 'false')
					this.gui_manager.global_visibility=global_vis=='true';
				//gather info
				if(info)
				if(info == 'true'|| info == 'false')
					this.gui_manager.gather_information=info=='true';
				//preserve colors
				if(colors)
				if(colors == 'true'|| colors == 'false')
					this.gui_manager.gather_information=colors=='true';
				//gather info
				if(info)
				if(info == 'true'|| info == 'false')
					this.gui_manager.gather_information=info=='true';
				//brusher
				brush_s=date_converter.formatRipe(date_converter.parseRipe(brush_s));
				brush_e=date_converter.formatRipe(date_converter.parseRipe(brush_e));
				if(gui_manager.validator.check_date_with_format(brush_s,gui_manager.date_converter.ripestat_data_format)&&gui_manager.validator.check_date_with_format(brush_e,gui_manager.date_converter.ripestat_data_format)){
					this.gui_manager.drawer.events_range=[];
					this.gui_manager.drawer.events_range[0]=moment(brush_s);
					this.gui_manager.drawer.events_range[1]=moment(brush_e);
				}
				//heuristic
				if(heuristic)
					this.gui_manager.ripe_data_broker.heuristics_manager.current_heuristic=heuristic;
				//sort_type
				if(heuristic_sort_type)
					this.gui_manager.ripe_data_broker.heuristics_manager.current_sort_type=heuristic_sort_type;
				this.gui_manager.ripe_data_broker.getData();
				request_done = true;
			}
			catch(e){
				alert(e)
				this.gui_manager.ripe_data_broker.current_starttime=null;
				this.gui_manager.ripe_data_broker.current_endtime=null;
				this.gui_manager.ripe_data_broker.current_targets=null;
			}
		}
		return request_done;
	};

	return ContextManager;
});