

define([
    "bgpst.lib.jquery-amd",
    "bgpst.view.parser",
    "bgpst.controller.dateconverter",
    "bgpst.view.heuristics",
    "bgpst.lib.moment",
    "bgpst.controller.functions"
], function($, RipeDataParser, DateConverter, HeuristicsManager, moment, myUtils){


    var RipeDataBroker = function(env) {
        env.logger.log("=== RipeBroker Starting");
        var $this = this;
        this.parser = new RipeDataParser(env);
        this.dateConverter = new DateConverter();
        env.dateConverter = this.dateConverter;
        this.heuristicsManager = new HeuristicsManager(env);
        this.ipv6_peerings = 0;
        this.ipv4_peerings = 0;
        env.logger.log("=== RipeBroker Ready");


        //do the ajax get
        this.getData = function() {
            var url_ris_peer_count = "https://stat.ripe.net/data/ris-peer-count/data.json";

            $.ajax({
                url: url_ris_peer_count,
                dataType: "json",
                data : {
                    starttime: env.queryParams.startDate.unix(),
                    endtime: env.queryParams.stopDate.unix()
                },
                success: function(data){
                    env.logger.log("=== RipeBroker Success! Peer count loaded");
                    env.logger.log(data);
                    try {
                        $this.ipv4_peerings = myUtils.max(data['data']['peer_count']['v4']['full_feed'].map(function(e){return e['count'];}));
                        $this.ipv6_peerings = myUtils.max(data['data']['peer_count']['v6']['full_feed'].map(function(e){return e['count'];}));
                        if($this.ipv6_peerings == 0 && env.queryParams.targets.some(function(e){return env.guiManager.validator.check_ipv6(e)}))
                            env.guiManager.global_visibility = false;
                        if($this.ipv4_peerings == 0 && env.queryParams.targets.some(function(e){return env.guiManager.validator.check_ipv4(e)}))
                            env.guiManager.global_visibility = false;
                    } catch(err) {
                        env.logger.log("=== RipeBroker Warning: empty peerings size");
                        $this.ipv6_peerings = 0;
                        $this.ipv4_peerings = 0;
                        env.guiManager.global_visibility = false;
                    }
                    $this.getBGPData();
                },
                fail: function (argument) {
                    alert("Server error");
                }
            });
        };


        this.getBGPData = function() {
            var url_bgplay = "https://stat.ripe.net/data/bgplay/data.json";
            $.ajax({
                url: url_bgplay,
                dataType: "json",
                data : {
                    resource: env.queryParams.targets.join(","),
                    starttime: env.queryParams.startDate.unix(),
                    endtime: env.queryParams.stopDate.unix()
                },
                success: function(data){
                    env.logger.log("=== RipeBroker Success! Data loaded from:"+url_bgplay);
                    env.logger.log(data);
                    try {
                        $this.current_parsed = $this.parser.ripe_response_parse(data, env.queryParams.startDate, env.queryParams.stopDate);
                        if(env.guiManager.gather_information){
                            env.logger.log("=== RipeBroker Starting gathering CP Info");
                            env.guiManager.rrc_info_done=false;
                            setTimeout(function(){
                                $this.getCPInfo($this.current_parsed.resources,0)
                            },0);
                        }
                        env.queryParams.targets = data.data.targets.map(function (e) {return e['prefix'].replace(/"/g,'');});
                        $this.loadCurrentState(true, env.guiManager.drawer.events_range, true);

                        if(env.guiManager.gather_information){
                            env.logger.log("=== RipeBroker Starting gathering ASN Info");
                            setTimeout(function(){
                                env.guiManager.asn_info_done=false;
                                if(env.guiManager.graph_type=="stream")
                                    $this.getASNInfo($this.current_parsed.asn_set,0);
                                else
                                if(env.guiManager.graph_type=="heat")
                                    $this.getASNInfo(env.guiManager.drawer.asn_set,0);
                            },0);
                        }
                    }
                    catch(err){
                        env.logger.log(err);
                        alert("No data found for this target in the interval of time selected");
                    }
                    finally {
                        env.guiManager.draw_functions_btn_enabler();
                    }
                },
                error: function(jqXHR, exception){
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
                }
            });
        };


        this.CPInfoCallBack = function(res) {
            var url_cp = "https://stat.ripe.net/data/geoloc/data.json?resource=" + res.ip;
            $.ajax({
                url: url_cp,
                dataType: "json",
                success: function(data){
                    res["geo"] = data.data.locations[0].country;
                    $this.current_parsed.known_cp[res.id] = res;
                },
                error: function(jqXHR, exception){
                    alert("failed CP lookup for "+res);
                }
            });
        };

        this.getCPInfo = function(resources,index) {
            if(index<resources.length){
                var res = resources[index];
                var r_id = res.id;
                if(!this.current_parsed.known_cp[r_id])
                    this.CPInfoCallBack(res);
                index++;
                this.getCPInfo(resources, index);
            }
            else{
                env.guiManager.cp_info_done = true;
                env.logger.log("=== RipeBroker CPinfo Completed");
            }
        };

        this.ASNInfoCallBack = function(res) {
            var url_asn = "https://stat.ripe.net/data/as-overview/data.json?resource=AS" + res;
            $.ajax({
                url: url_asn,
                dataType: "json",
                success: function(data){
                    $this.current_parsed.known_asn[res] = data.data.holder;
                },
                error: function(jqXHR, exception){
                    alert("failed ASN lookup for "+res);
                }
            });
        };

        this.getASNInfo = function(resources,index) {
            if(index<resources.length){
                var res = resources[index]
                if(!this.current_parsed.known_asn[res] && !isNaN(parseInt(res)))
                    this.ASNInfoCallBack(res);
                index++;
                this.getASNInfo(resources, index);
            }
            else{
                env.guiManager.asn_info_done = true;
                env.logger.log("=== RipeBroker ASNinfo Completed");
            }
        };

        this.brush = function(events_range){
            this.loadCurrentState(null,events_range,false);
        };

        this.loadCurrentState = function(store, events_range, redraw_minimap) {
            console.log("update");
            env.guiManager.ip_version_checkbox_enabler();
            env.guiManager.restoreQuery();
            var ordering;
            if(env.guiManager.gather_information){
                env.logger.log("=== RipeBroker Starting gathering CP Info");
                env.guiManager.cp_info_done = false;
                setTimeout(function(){
                    $this.getCPInfo($this.current_parsed.resources,0)
                },0);
                env.logger.log("=== RipeBroker Starting gathering ASN Info");
                setTimeout(function(){
                    env.guiManager.asn_info_done = false;
                    if(env.guiManager.graph_type == "stream")
                        $this.getASNInfo($this.current_parsed.asn_set,0);
                    else
                    if(env.guiManager.graph_type == "heat")
                        $this.getASNInfo(env.guiManager.drawer.asn_set,0);
                },0);
            }
            /*COMMON*/

            this.current_asn_tsv = this.parser.convert_to_streamgraph_tsv(this.current_parsed, env.guiManager.prepending_prevention, env.guiManager.asn_level, env.guiManager.ip_version);
            this.parser.states_cp(this.current_parsed,env.guiManager.asn_level,env.guiManager.prepending_prevention);
            this.parser.cp_composition(this.current_parsed);
            this.parser.cp_seqs(this.current_parsed);
            this.parser.asn_exchanges(this.current_parsed);
            this.current_visibility = 0;
            if(env.guiManager.global_visibility) {
                for(var t in this.current_parsed.targets){
                    var tgs = this.current_parsed.targets[t];
                    if(env.guiManager.ip_version.indexOf(4) != -1 && env.guiManager.validator.check_ipv4(tgs)){
                        env.logger.log("== RipeBroker adding ipv4 peerings");
                        this.current_visibility+=this.ipv4_peerings;
                    }
                    if(env.guiManager.ip_version.indexOf(6) != -1 && env.guiManager.validator.check_ipv6(tgs)){
                        env.logger.log("== RipeBroker adding ipv6 peerings");
                        this.current_visibility+=this.ipv6_peerings;
                    }
                }
            }
            else
                this.current_visibility = this.current_parsed.local_visibility;
            //STREAM
            if(env.guiManager.graph_type == "stream") {
                //ORDERING
                ordering = this.heuristicsManager.getCurrentOrdering(this.current_parsed, env.guiManager.graph_type);
                if(!ordering) {
                    ordering = this.current_parsed.asn_set;
                }
                env.guiManager.update_counters(".counter_asn", this.current_parsed.asn_set.length);
                env.guiManager.update_counters(".counter_events", this.current_parsed.events.length);

                env.guiManager.drawer.draw_streamgraph(
                    this.current_parsed,
                    env.guiManager.graph_type,
                    this.current_asn_tsv,
                    ordering,
                    env.guiManager.preserve_map,
                    this.current_visibility,
                    this.current_parsed.targets,
                    this.current_parsed.query_id,
                    $this.gotToBgplayFromPosition,
                    null,
                    events_range,
                    redraw_minimap);
                this.heuristicsManager.MetricsManager.metrics(this.current_parsed, env.guiManager.drawer.keys);
                env.guiManager.isGraphPresent();

            } else if(env.guiManager.graph_type == "heat") { // HEAT

                this.current_cp_tsv = this.parser.convert_to_heatmap_tsv(this.current_parsed, env.guiManager.prepending_prevention, env.guiManager.asn_level, env.guiManager.ip_version);
                //ORDERING
                ordering = this.heuristicsManager.getCurrentOrdering(this.current_parsed, env.guiManager.graph_type);
                if (!ordering) {
                    env.logger.log("ordering non c'è");
                    ordering = this.current_parsed.cp_set;
                } else {
                    env.logger.log("ordering c'è");
                }
                env.guiManager.drawer.draw_heatmap(
                    this.current_parsed,
                    this.current_cp_tsv,
                    this.current_asn_tsv,
                    ordering,
                    env.guiManager.preserve_map,
                    this.current_visibility,
                    this.current_parsed.targets,
                    this.current_parsed.query_id,
                    $this.gotToBgplayFromPosition,
                    env.guiManager.asn_level,
                    env.guiManager.ip_version,
                    env.guiManager.prepending_prevention,
                    env.guiManager.merge_cp,
                    env.guiManager.merge_events,
                    env.guiManager.events_labels,
                    env.guiManager.cp_labels,
                    env.guiManager.heatmap_time_map,
                    events_range,
                    redraw_minimap);
                if (env.guiManager.merge_events) {
                    env.guiManager.update_counters(".counter_events", env.guiManager.drawer.event_set.length + "/" + this.current_parsed.events.length);
                } else {
                    env.guiManager.update_counters(".counter_events", this.current_parsed.events.length);
                }
                if(env.guiManager.merge_cp)
                    env.guiManager.update_counters(".counter_asn", env.guiManager.drawer.keys.length+"/"+this.current_parsed.cp_set.length);
                else
                    env.guiManager.update_counters(".counter_asn", env.guiManager.drawer.keys.length);
            }
            else {
                alert("nè heat nè stream, problema!");
                env.guiManager.drawer.drawer_init();
            }
            env.guiManager.boolean_checker();
            env.guiManager.draw_functions_btn_enabler();
        };

        this.go_to_bgplay = function(start, end, targets, pos){

            var url = "https://stat.ripe.net/widget/bgplay#";
            url+="w.resource="+targets;
            url+="&w.starttime="+start;
            url+="&w.endtime="+end;
            url+="&w.instant="+this.dateConverter.formatUnix(pos);
            url+="&w.type=bgp";
            env.logger.log("con utc"+moment(pos).utc().unix(pos));
            env.logger.log("senza utc"+moment(pos).unix(pos));
            env.logger.log("GO TO BGPLAY AT "+url);
            return window.open(url,'_blank');
        };

        this.streamgraph_streaming = function(every) {
            var interval_id = setInterval(function (){
                // var date = moment(new Date());
                // var formatted = $this.DateConverter.formatRipe(date);
                $this.getData();
                env.logger.log("Streaming got new data!");
            }, every);
            env.logger.log("Streaming started with interval ID: "+interval_id);
            return interval_id;
        };

        this.streamgraph_stepped_view = function(every) {
            var max = this.current_asn_tsv.split("\n").length-1;
            var i = 2;
            var interval_id = setInterval(function (){
                if(i>max){
                    clearInterval(interval_id);
                    env.guiManager.steps = false;
                    env.guiManager.draw_functions_btn_enabler();
                }
                else {
                    core(i);
                    i+=1;
                }
            },every);
            env.logger.log("Step view started with interval ID: "+interval_id);

            function core(i) {
                env.guiManager.drawer.draw_streamgraph($this.current_parsed, env.guiManager.graph_type, $this.current_asn_tsv, env.guiManager.drawer.keys, env.guiManager.preserve_map, $this.current_visibility, $this.current_parsed.targets, $this.current_parsed.query_id, $this.gotToBgplayFromPosition, i, null, false);
                env.guiManager.update_counters(".counter_asn", $this.current_parsed.asn_set.length);
                env.guiManager.update_counters(".counter_events", i + "/" + max);
            }
        };

        this.gotToBgplayFromPosition = function(pos){
            return $this.go_to_bgplay(env.queryParams.startDate, env.queryParams.stopDate, env.queryParams.targets, pos);
        };
    };

    return RipeDataBroker;
});