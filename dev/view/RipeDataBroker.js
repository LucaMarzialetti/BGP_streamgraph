

define([
    "bgpst.env.utils",
    "bgpst.lib.jquery-amd",
    "bgpst.view.parser",
    "bgpst.controller.dateconverter",
    "bgpst.view.heuristics",
    "bgpst.lib.moment",
    "bgpst.controller.functions"
], function(utils, $, RipeDataParser, DateConverter, HeuristicsManager, moment, myUtils){


    var RipeDataBroker = function(env) {
        env.logger.log("=== RipeBroker Starting");
        var $this = this;
        this.parser = new RipeDataParser(env);
        this.dateConverter = new DateConverter();
        env.dateConverter = this.dateConverter;
        this.heuristicsManager = new HeuristicsManager(env);
        this.ipv6_peerings = 0;
        this.ipv4_peerings = 0;

        /**error strings**/
        this.errors = {
            invalidTarget: "Invalid Target",
            invalidDate: "Invalid Date",
            peercountEmpty: "Peer count empty, global visibility may is not available",
            peercountFail: "Peer count internal error, global visibility may is not available",
            bgplayEmpty: "No data found",
            parsingError: "Something went wrong",
            bgplayFail4: "Server internal error",
            bgplayFail5: "Something went wrong",
            bgplayFailDef: "Something went wrong",
            cpInfoError: "Collector peer missing informations",
            asnInfoError: "AS missing informations"
        };

        env.logger.log("=== RipeBroker Ready");
        //do the ajax get
        this.dataRequest = function(){
            $this.getPeerCountData();
            $this.getBGPData();
        };

        this.getPeerCountData = function() {
            var url_ris_peer_count = "https://stat.ripe.net/data/ris-peer-count/data.json";
            $.ajax({
                url: url_ris_peer_count,
                dataType: "json",
                data : {
                    starttime: env.queryParams.startDate.unix(),
                    endtime: env.queryParams.stopDate.unix(),
                    "v4_full_prefix_threshold": 1,
                    "v6_full_prefix_threshold": 1 
                },
                success: function(data){
                    env.logger.log("=== RipeBroker Success! Peer count loaded");
                    env.logger.log(data);
                    try {
                        $this.ipv4_peerings = myUtils.max(data['data']['peer_count']['v4']['full_feed'].map(function(e){return e['count'];}));
                        $this.ipv6_peerings = myUtils.max(data['data']['peer_count']['v6']['full_feed'].map(function(e){return e['count'];}));
                        if($this.ipv6_peerings == 0 && env.queryParams.targets.some(utils.validateIPv6))
                            env.guiManager.global_visibility = false;
                        if($this.ipv4_peerings == 0 && env.queryParams.targets.some(utils.validateIPv6))
                            env.guiManager.global_visibility = false;
                    } catch(err) {
                        utils.observer.publish("error", $this.errors.peercountEmpty);
                        env.logger.log("=== RipeBroker Warning: empty peerings size");
                        $this.ipv6_peerings = 0;
                        $this.ipv4_peerings = 0;
                        env.guiManager.global_visibility = false;
                    }
                },
                fail: function (argument) {
                    utils.observer.publish("error", $this.errors.peercountFail);
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
                        if(Array.isArray(data['data']['events']) && data['data']['events'].length<1 && Array.isArray(data['data']['initial_state']) && data['data']['initial_state'].length<1){
                            console.log("=== RipeBroker empty response ! ");
                            utils.observer.publish("error", $this.errors.bgplayEmpty);
                            return false;
                        } else {
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
                    } catch(err) {
                        console.log(err);
                        utils.observer.publish("error", $this.errors.parsingError);
                    }
                    finally {
                        env.guiManager.draw_functions_btn_enabler();
                    }
                },
                error: function(jqXHR, exception){
                    switch(jqXHR.status){
                        case 404:
                            utils.observer.publish("error", $this.errors.bgplayFail4);
                            break;
                        case 500:
                            utils.observer.publish("error", $this.errors.bgplayFail5);
                            break;
                        default:
                            utils.observer.publish("error", $this.errors.bgplayFailDef);
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
                    utils.observer.publish("error", $this.errors.cpInfoError);
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
                    utils.observer.publish("error", $this.errors.asnInfoError);
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
            this.use_ipv4_vis = env.guiManager.ip_version.indexOf(4) != -1;
            this.use_ipv6_vis = env.guiManager.ip_version.indexOf(6) != -1;

            if(env.guiManager.global_visibility) {
                for(var t=0; t<this.current_parsed.targets.length; t++){
                    var tgs = this.current_parsed.targets[t];
                    if(this.use_ipv4_vis && utils.validateIPv4(tgs)){
                        env.logger.log("== RipeBroker adding ipv4 peerings");
                        this.current_visibility+=this.ipv4_peerings;
                    }
                    if(this.use_ipv6_vis && utils.validateIPv6(tgs)){
                        env.logger.log("== RipeBroker adding ipv6 peerings");
                        this.current_visibility+=this.ipv6_peerings;
                    }
                }
            }
            if(this.current_visibility<this.current_parsed.local_visibility){
                this.current_visibility=this.current_parsed.local_visibility;
                env.guiManager.global_visibility=false;
            }
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
                env.guiManager.drawer.drawer_init();
            }
            env.guiManager.boolean_checker();
            env.guiManager.draw_functions_btn_enabler();
        };

        this.go_to_bgplay = function(start, end, targets, pos){

            var url = "https://stat.ripe.net/widget/bgplay#";
            url+="w.resource=" + targets;
            url+="&w.starttime=" + start;
            url+="&w.endtime=" + end;
            url+="&w.instant=" + this.dateConverter.formatUnix(pos);
            url+="&w.type=bgp";
            env.logger.log("con utc" + moment(pos).utc().unix(pos));
            env.logger.log("senza utc" + moment(pos).unix(pos));
            env.logger.log("GO TO BGPLAY AT " + url);
            return window.open(url,'_blank');
        };

        this.streamgraph_streaming = function(every) {
            var call = function (){
                var timeWindow = env.queryParams.stopDate.diff(env.queryParams.startDate, "seconds");
                env.queryParams.stopDate = moment.utc();
                env.queryParams.startDate = moment(env.queryParams.stopDate).subtract(timeWindow, "seconds");
                $this.dataRequest();
                env.logger.log("Streaming got new data!");
            };
            call();
            var interval_id = setInterval(call, every);
            //env.logger
            console.log("Streaming started with interval ID: " + interval_id);
            return interval_id;
        };

        this.streamgraph_stepped_view = function(every) {
            env.guiManager.step_max = env.guiManager.drawer.step_max;
            if(env.guiManager.current_step<2)
                env.guiManager.current_step = 2;
            var interval_id = setInterval(function (){
                if(env.guiManager.current_step>env.guiManager.step_max){
                    clearInterval(env.guiManager.steps_interval);
                    delete env.guiManager.steps_interval;
                    env.guiManager.current_step = 0;
                    env.guiManager.steps = false;
                    env.guiManager.dom.stepsStartButton.removeClass("hidden");
                    env.guiManager.dom.stepsPauseButton.addClass("hidden");
                    env.guiManager.dom.stepsStopButton.addClass("hidden");
                    env.guiManager.draw_functions_btn_enabler();
                    console.log("Step view ended");
                } else {
                    $this.steps_core(env.guiManager.current_step);
                    env.guiManager.current_step+=1;
                }
            },every);
            //env.logger
            console.log("Step view started with interval ID: "+interval_id);
            return interval_id;
        };

        this.steps_core = function(i) {
            env.guiManager.drawer.draw_streamgraph($this.current_parsed, env.guiManager.graph_type, $this.current_asn_tsv, env.guiManager.drawer.keys, env.guiManager.preserve_map, $this.current_visibility, $this.current_parsed.targets, $this.current_parsed.query_id, $this.gotToBgplayFromPosition, i, null, false);
            env.guiManager.update_counters(".counter_asn", $this.current_parsed.asn_set.length);
            env.guiManager.update_counters(".counter_events", i + "/" + env.guiManager.step_max);
        };

        this.gotToBgplayFromPosition = function(pos){
            return $this.go_to_bgplay(env.queryParams.startDate, env.queryParams.stopDate, env.queryParams.targets, pos);
        };
    };

    return RipeDataBroker;
});