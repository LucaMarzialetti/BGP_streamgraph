define([
    /*date converter*/
    /*gui manager*/
    /*heuristic manager*/
    /*graph drawer*/
    /*context*/
    /*moment*/
    "bgpst.controller.dateconverter",
    "bgpst.view.gui",
    "bgpst.view.heuristics"
    "bgpst.view.graphdrawer",
    "bgpst.view.context",
    "bgpst.lib.moment"
], function(DateConverter, GuiManager, HeuristicsManager, graph_drawer, context_manager, moment){

    var RipeDataBroker = function(drawer, context, GuiManager) {
        console.log("=== RipeBroker Starting");
        this.drawer = drawer;
        this.context = context;
        this.GuiManager = GuiManager;
        this.parser = new RipeDataParser();
        this.DateConverter = new DateConverter();
        this.HeuristicsManager = new HeuristicsManager(this.GuiManager.graph_type);
        this.ipv6_peerings = 0;
        this.ipv4_peerings = 0;
        console.log("=== RipeBroker Ready");
    };

    //format GET url for ripestat query
    RipeDataBroker.prototype.requestBuilder = function(start_d,start_t,end_d,end_t,targets) {
        this.current_starttime = this.DateConverter.formatRipeDateTime(this.DateConverter.parseInterfaceDate(start_d), this.DateConverter.parseInterfaceTime(start_t));
        this.current_endtime = this.DateConverter.formatRipeDateTime(this.DateConverter.parseInterfaceDate(end_d), this.DateConverter.parseInterfaceTime(end_t));
        this.current_targets = "resource="+targets;
        var starttime = "&starttime="+start_ts;
        var endtime = "&endtime="+end_ts;
        var get_url = base_url+this.current_targets+starttime+endtime;
        return get_url;
    };

    //format GET url for ripestat query
    RipeDataBroker.prototype.requestBuilderData = function(start_d,start_t,end_d,end_t,targets) {
        this.current_starttime = this.DateConverter.formatRipeDateTime(start_d,start_t);
        this.current_endtime = this.DateConverter.formatRipeDateTime(end_d,end_t);
        this.current_targets = targets;
    };

    //do the ajax get
    RipeDataBroker.prototype.getData = function(start_d,end_d,targets) {
        var RipeDataBroker = this;
        if(start_d != null)
            this.current_starttime = start_d;
        if(end_d != null)
            this.current_endtime = end_d;
        if(targets != null)
            this.current_targets = targets;
        //https://stat.ripe.net/data/bgplay/data.json?resource=140.78/16&starttime=2012-12-21T07:00&endtime=2012-12-21T12:00
        var url_ris_peer_count = "https://stat.ripe.net/data/ris-peer-count/data.json";
        $.ajax({
            url: url_ris_peer_count,
            dataType: "json",
            //unix_timestamps: true,
            data : {
                starttime: RipeDataBroker.DateConverter.formatRipe(moment(this.current_starttime).subtract(1,"months")),
                endtime: RipeDataBroker.DateConverter.formatRipe(moment(this.current_endtime).add(1,"months"))
            },
            success: function(data){
                console.log("=== RipeBroker Success! Peer count loaded");
                console.log(data);
                try {
                    RipeDataBroker.ipv4_peerings = max(data['data']['peer_count']['v4']['full_feed'].map(function(e){return e['count'];}));
                    RipeDataBroker.ipv6_peerings = max(data['data']['peer_count']['v6']['full_feed'].map(function(e){return e['count'];}));
                    if(RipeDataBroker.ipv6_peerings == 0 && targets.split(",").some(function(e){return RipeDataBroker.GuiManager.validator.check_ipv6(e)}))
                        RipeDataBroker.GuiManager.global_visibility = false;
                    if(RipeDataBroker.ipv4_peerings == 0 && targets.split(",").some(function(e){return RipeDataBroker.GuiManager.validator.check_ipv4(e)}))
                        RipeDataBroker.GuiManager.global_visibility = false;
                    RipeDataBroker.context.storeContext({4:RipeDataBroker.ipv4_peerings, 6:RipeDataBroker.ipv6_peerings},"last_context_peerings");
                }
                catch(err) {
                    console.log("=== RipeBroker Warning: empty peerings size");
                    RipeDataBroker.ipv6_peerings = 0;
                    RipeDataBroker.ipv4_peerings = 0;
                    RipeDataBroker.GuiManager.global_visibility = false;
                }
                RipeDataBroker.getBGPData();
            },
            fail: function (argument) {
                alert("Server error");
            }
        });
    };

    RipeDataBroker.prototype.CPInfoCallBack = function(res) {
        var url_cp = "https://stat.ripe.net/data/geoloc/data.json?resource="+res.ip;
        var RipeDataBroker = this;
        $.ajax({
            url: url_cp,
            dataType: "json",
            success: function(data){
                res["geo"] = data.data.locations[0].country;
                RipeDataBroker.current_parsed.known_cp[res.id] = res;
            },
            error: function(jqXHR, exception){
                alert("failed CP lookup for "+res);
            }
        });
    };

    RipeDataBroker.prototype.getCPInfo = function(resources,index) {
        if(index<resources.length){
            var res = resources[index];
            var r_id = res.id;
            if(!this.current_parsed.known_cp[r_id])
                this.CPInfoCallBack(res);
            index++;
            this.getCPInfo(resources, index);
        }
        else{
            this.GuiManager.cp_info_done = true;
            console.log("=== RipeBroker CPinfo Completed");
        }
    };

    RipeDataBroker.prototype.ASNInfoCallBack = function(res) {
        var url_asn = "https://stat.ripe.net/data/as-overview/data.json?resource=AS"+res;
        var RipeDataBroker = this;
        $.ajax({
            url: url_asn,
            dataType: "json",
            success: function(data){
                RipeDataBroker.current_parsed.known_asn[res] = data.data.holder;
            },
            error: function(jqXHR, exception){
                alert("failed ASN lookup for "+res);
            }
        });
    };

    RipeDataBroker.prototype.getASNInfo = function(resources,index) {
        if(index<resources.length){
            var res = resources[index]
            if(!this.current_parsed.known_asn[res] && !isNaN(parseInt(res)))
                this.ASNInfoCallBack(res);
            index++;
            this.getASNInfo(resources, index);
        }
        else{
            this.GuiManager.asn_info_done = true;
            console.log("=== RipeBroker ASNinfo Completed");
        }
    };

    RipeDataBroker.prototype.brush = function(events_range){
        this.loadCurrentState(null,events_range,false);
    };

    RipeDataBroker.prototype.loadCurrentState = function(store, events_range, redraw_minimap) {
        RipeDataBroker = this;
        this.GuiManager.changeLoaderText("Drawing the chart!");
        this.GuiManager.ip_version_checkbox_enabler();
        this.GuiManager.restoreQuery(this.current_starttime, this.current_endtime, this.current_targets);
        var ordering;
        if(this.GuiManager.gather_information){
            console.log("=== RipeBroker Starting gathering CP Info");
            RipeDataBroker.GuiManager.cp_info_done = false;
            setTimeout(function(){
                RipeDataBroker.getCPInfo(RipeDataBroker.current_parsed.resources,0)
            },0);
            console.log("=== RipeBroker Starting gathering ASN Info");
            setTimeout(function(){
                RipeDataBroker.GuiManager.asn_info_done = false;
                if(RipeDataBroker.GuiManager.graph_type == "stream")
                    RipeDataBroker.getASNInfo(RipeDataBroker.current_parsed.asn_set,0);
                else
                if(RipeDataBroker.GuiManager.graph_type == "heat")
                    RipeDataBroker.getASNInfo(RipeDataBroker.GuiManager.drawer.asn_set,0);
            },0);
        }
        /*COMMON*/
        this.current_asn_tsv = this.parser.convert_to_streamgraph_tsv(this.current_parsed, this.GuiManager.prepending_prevention, this.GuiManager.asn_level, this.GuiManager.ip_version);
        this.parser.states_cp(this.current_parsed,this.GuiManager.asn_level,this.GuiManager.prepending_prevention);
        this.parser.cp_composition(this.current_parsed);
        this.parser.cp_seqs(this.current_parsed);
        this.parser.asn_exchanges(this.current_parsed);
        this.current_visibility = 0;
        if(this.GuiManager.global_visibility) {
            for(var t in this.current_parsed.targets){
                var tgs = this.current_parsed.targets[t];
                if(this.GuiManager.ip_version.indexOf(4) != -1 && this.GuiManager.validator.check_ipv4(tgs)){
                    console.log("== RipeBroker adding ipv4 peerings");
                    this.current_visibility+=this.ipv4_peerings;
                }
                if(this.GuiManager.ip_version.indexOf(6) != -1 && this.GuiManager.validator.check_ipv6(tgs)){
                    console.log("== RipeBroker adding ipv6 peerings");
                    this.current_visibility+=this.ipv6_peerings;
                }
            }
        }
        else
            this.current_visibility = this.current_parsed.local_visibility;
        //STREAM
        if(this.GuiManager.graph_type == "stream") {
            //ORDERING
            ordering = this.HeuristicsManager.getCurrentOrdering(this.current_parsed, this.GuiManager.graph_type);
            if(!ordering)
                ordering = this.current_parsed.asn_set;
            this.GuiManager.update_counters(".counter_asn",this.current_parsed.asn_set.length);
            this.GuiManager.update_counters(".counter_events",this.current_parsed.events.length);
            this.drawer.draw_streamgraph(this.current_parsed, this.GuiManager.graph_type, this.current_asn_tsv, ordering, this.GuiManager.preserve_map, this.current_visibility, this.current_parsed.targets, this.current_parsed.query_id, function(pos){return RipeDataBroker.go_to_bgplay(RipeDataBroker.current_starttime,RipeDataBroker.current_endtime,RipeDataBroker.current_targets,pos)},null,events_range, redraw_minimap);
            this.HeuristicsManager.MetricsManager.metrics(this.current_parsed, this.drawer.keys);
            this.GuiManager.isGraphPresent = d3.select("svg").select(".chart").node() != null;
        }
        else
        //HEAT
        if(this.GuiManager.graph_type == "heat") {
            this.current_cp_tsv = this.parser.convert_to_heatmap_tsv(this.current_parsed, this.GuiManager.prepending_prevention, this.GuiManager.asn_level, this.GuiManager.ip_version);
            //ORDERING
            ordering = this.HeuristicsManager.getCurrentOrdering(this.current_parsed, this.GuiManager.graph_type);
            if(!ordering){
                console.log("ordering non c'è")
                ordering = this.current_parsed.cp_set;
            }
            else
                console.log("ordering c'è")
            this.drawer.draw_heatmap(this.current_parsed, this.current_cp_tsv, this.current_asn_tsv, ordering, this.GuiManager.preserve_map, this.current_visibility, this.current_parsed.targets, this.current_parsed.query_id, function(pos){return RipeDataBroker.go_to_bgplay(RipeDataBroker.current_starttime,RipeDataBroker.current_endtime,RipeDataBroker.current_targets,pos)}, this.GuiManager.asn_level, this.GuiManager.ip_version, this.GuiManager.prepending_prevention, this.GuiManager.merge_cp, this.GuiManager.merge_events, this.GuiManager.events_labels, this.GuiManager.cp_labels, this.GuiManager.heatmap_time_map, events_range, redraw_minimap);
            if(this.GuiManager.merge_events)
                this.GuiManager.update_counters(".counter_events",this.GuiManager.drawer.event_set.length+"/"+this.current_parsed.events.length);
            else
                this.GuiManager.update_counters(".counter_events",this.current_parsed.events.length);

            if(this.GuiManager.merge_cp)
                this.GuiManager.update_counters(".counter_asn", this.GuiManager.drawer.keys.length+"/"+this.current_parsed.cp_set.length);
            else
                this.GuiManager.update_counters(".counter_asn", this.GuiManager.drawer.keys.length);
            this.GuiManager.isGraphPresent = d3.select("svg").select(".chart").node() != null;
        }
        else {
            alert("nè heat nè stream, problema!");
            this.GuiManager.drawer.drawer_init();
            this.GuiManager.isGraphPresent = false;
        }
        if(store)
            this.context.storeContext(this.current_parsed,"last_context_original_data");
        //window.scrollTo(0,document.body.scrollHeight);
        this.GuiManager.boolean_checker();
        this.GuiManager.draw_last_data_btn_enabler();
        this.GuiManager.draw_functions_btn_enabler();
        this.GuiManager.url_string();
    };

    RipeDataBroker.prototype.go_to_bgplay = function(start,end,targets,pos){
        //https://stat.ripe.net/widget/bgplay#w.ignoreReannouncements=false&w.resource=93.35.170.87,23.1.0.0/24&w.starttime=1489313137&w.endtime=1489572337&w.cps=0,1,2,5,6,7,10,11,13,14,15,16,18,20&w.instant=null&w.type=bgp
        var url = "https://stat.ripe.net/widget/bgplay#";
        url+="w.resource="+targets;
        url+="&w.starttime="+start;
        url+="&w.endtime="+end;
        url+="&w.instant="+this.DateConverter.formatUnix(pos);
        url+="&w.type=bgp";
        console.log("con utc"+moment(pos).utc().unix(pos));
        console.log("senza utc"+moment(pos).unix(pos));
        console.log("GO TO BGPLAY AT "+url);
        return window.open(url,'_blank');
    };

    RipeDataBroker.prototype.streamgraph_streaming = function(every) {
        RipeDataBroker = this;
        var interval_id = setInterval(function (){
            RipeDataBroker.GuiManager.toggleLoader();
            var date = moment(new Date());
            var formatted = RipeDataBroker.DateConverter.formatRipe(date);
            RipeDataBroker.getData(RipeDataBroker.current_starttime, formatted, RipeDataBroker.current_targets);
            console.log("Streaming got new data!");
        }, every);
        console.log("Streaming started with interval ID: "+interval_id);
        return interval_id;
    };

    RipeDataBroker.prototype.streamgraph_stepped_view = function(every) {
        var RipeDataBroker = this;
        var max = this.current_asn_tsv.split("\n").length-1;
        var i = 2;
        var interval_id = setInterval(function (){
            if(i>max){
                clearInterval(interval_id);
                console.log("Step view over");
                RipeDataBroker.GuiManager.steps = false;
                RipeDataBroker.GuiManager.draw_functions_btn_enabler();
            }
            else {
                core(i);
                i+=1;
            }
        },every);
        console.log("Step view started with interval ID: "+interval_id);

        function core(i) {
            RipeDataBroker.drawer.draw_streamgraph(RipeDataBroker.current_parsed, RipeDataBroker.GuiManager.graph_type, RipeDataBroker.current_asn_tsv, RipeDataBroker.drawer.keys, RipeDataBroker.GuiManager.preserve_map, RipeDataBroker.current_visibility, RipeDataBroker.current_parsed.targets, RipeDataBroker.current_parsed.query_id, function(pos){return RipeDataBroker.go_to_bgplay(RipeDataBroker.current_starttime,RipeDataBroker.current_endtime,RipeDataBroker.current_targets,pos)},i,null,false);
            RipeDataBroker.GuiManager.update_counters(".counter_asn",RipeDataBroker.current_parsed.asn_set.length);
            RipeDataBroker.GuiManager.update_counters(".counter_events",i+"/"+max);
        };
    };

    return RipeDataBroker;
});