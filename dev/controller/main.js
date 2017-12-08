define([
    "bgpst.env.utils",
    "bgpst.view.graphdrawer",
    "bgpst.view.gui"
], function(utils, GraphDrawer, GuiManager){

    var Main = function(env) {
        this.exposedMethods = ["getVersion", "on", "init"];

        this.getVersion = function(){
            return env.version;
        };

        this.on = function(event, callback){
            utils.observer.subscribe(event, callback, this);
        };

        this.init = function(){
            env.guiManager = new GuiManager(env);
            env.guiManager.init();
            // if(!this.checkRequest()) {
            //     env.guiManager.toggleLoader();
            // }
        };



        // this.getLocalParameters = function() {
        //     var vars = [], hash;
        //     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        //     for(var i = 0; i < hashes.length; i++) {
        //         hash = hashes[i].split('=');
        //         vars.push(hash[0]);
        //         vars[hash[0]] = hash[1];
        //     }
        //     return vars;
        // };

        // this.checkRequest = function(){
        //     var dateConverter = env.guiManager.DateConverter;
        //     var validator = env.guiManager.validator;
        //     var params = this.getLocalParameters();
        //     var start = params["w.starttime"];
        //     var end = params["w.endtime"];
        //     var tgt = params["w.resources"];
        //     var type = params["w.type"];
        //     var level = params["w.level"];
        //     var prepending = params["w.prepending"];
        //     var merge_cp = params["w.merge_cp"];
        //     var merge_events = params["w.merge_events"];
        //     var timemap = params["w.timemap"];
        //     var global_vis = params["w.global"];
        //     var colors = params['w.colors'];
        //     var info = params["w.info"];
        //     var brush_s = params["w.brush_s"];
        //     var brush_e = params["w.brush_e"];
        //     var heuristic = params["w.heu"];
        //     var heuristic_sort_type = params["w.sort_type"];
        //     var request_done = false;
        //
        //     if(start && end && tgt){
        //         tgt = tgt.replace(/#$/,"");
        //         try{
        //             //dates
        //             start = dateConverter.parseRipe(start);
        //             end = dateConverter.parseRipe(end);
        //             // if(env.guiManager.validator.check_date_with_format(start, env.guiManager.DateConverter.ripestat_data_format) && env.guiManager.validator.check_date_with_format(end, env.guiManager.DateConverter.ripestat_data_format)){
        //             env.params.startDate = start;
        //             env.params.stopDate = end;
        //             // } else {
        //             //     throw "wrong dates";
        //             // }
        //             //targets
        //             var tgt_list = tgt.split(',');
        //             var validateIps = function(ip){
        //                 return validator.check_ipv4(ip) || validator.check_ipv6(ip) || validator.check_asn(ip);
        //             };
        //
        //             if(tgt_list.every(validateIps)) {
        //                 env.params.targets = tgt;
        //             } else {
        //                 throw "wrong target";
        //             }
        //             //type
        //             if(type && (type == "stream" || type == "heat")) {
        //                 env.guiManager.graph_type = type;
        //             }
        //             //level
        //             if(level){
        //                 level = parseInt(level);
        //                 if(!isNaN(level)) {
        //                     env.guiManager.asn_level = level;
        //                 }
        //             }
        //             //merge cp
        //             if(merge_cp && (merge_cp == 'true'|| merge_cp == 'false')) {
        //                 env.guiManager.merge_cp = merge_cp == 'true';
        //             }
        //             //merge events
        //             if(merge_events){
        //                 merge_events = parseInt(merge_events);
        //                 if(!isNaN(merge_events)) {
        //                     env.guiManager.merge_events = merge_events;
        //                 }
        //             }
        //             //timemap
        //             if(timemap && (timemap == 'true'|| timemap == 'false')) {
        //                 env.guiManager.heatmap_time_map = timemap == 'true';
        //             }
        //             //global visibility
        //             if(global_vis && (global_vis == 'true'|| global_vis == 'false')) {
        //                 env.guiManager.global_visibility = global_vis == 'true';
        //             }
        //             //gather info
        //             if(info && (info == 'true'|| info == 'false')) {
        //                 env.guiManager.gather_information = info == 'true';
        //             }
        //             //preserve colors
        //             if(colors && (colors == 'true'|| colors == 'false')) {
        //                 env.guiManager.gather_information = colors == 'true';
        //             }
        //             //gather info
        //             if(info && (info == 'true'|| info == 'false')) {
        //                 env.guiManager.gather_information = info == 'true';
        //             }
        //
        //             //brusher
        //             brush_s = dateConverter.formatRipe(dateConverter.parseRipe(brush_s));
        //             brush_e = dateConverter.formatRipe(dateConverter.parseRipe(brush_e));
        //             if(env.guiManager.validator.check_date_with_format(brush_s,env.guiManager.DateConverter.ripestat_data_format) && env.guiManager.validator.check_date_with_format(brush_e, env.guiManager.DateConverter.ripestat_data_format)){
        //                 env.guiManager.drawer.events_range = [];
        //                 env.guiManager.drawer.events_range[0] = moment(brush_s);
        //                 env.guiManager.drawer.events_range[1] = moment(brush_e);
        //             }
        //             //heuristic
        //             if(heuristic) {
        //                 env.guiManager.RipeDataBroker.HeuristicsManager.current_heuristic = heuristic;
        //             }
        //             //sort_type
        //             if(heuristic_sort_type) {
        //                 env.guiManager.RipeDataBroker.HeuristicsManager.current_sort_type = heuristic_sort_type;
        //             }
        //             env.guiManager.RipeDataBroker.getData();
        //             request_done = true;
        //         }
        //         catch(e){
        //             console.log(e);
        //             env.params.startDate = null;
        //             env.params.stopDate = null;
        //             env.params.targets = null;
        //         }
        //     }
        //     return request_done;
        // };
    };

    return Main;
});