/**
 * MainView is the views initialiser and coordinator.
 * The interaction between "model" and view is made by the Observer pattern as suggested by the MVC pattern
 *
 * Due to the simplicity of the project:
 * - there is no real "model" layer, just an internal data structure.
 *      The data structure is anyway decoupled from the input by the connector/TranslationConnector
 *      In a more complex situation the connector would provide JS objects of the model layer.
 * - there are no controllers in this architecture.
 *      The few functions (the time range slider) are implemented in here (a sort of MV*).
 *
 *
 * All the modular views are loaded with require as dependencies and inserted in components.
 * All views must have a "render" method. (in ES6 I would have used an extendible class to do proper polymorphism)
 *
 * Templating is done with html (view/html) snippets and mustache.js, loaded with stache in require.
 */

define([
    "bgpst.view.graphdrawer",
    "bgpst.view.gui"
], function(GraphDrawer, GuiManager){

    var MainView = function() {

        this.init = function() {
            console.log("= Context Manager Starting");
            this.drawer = new GraphDrawer();
            this.guiManager = new GuiManager(this.drawer, this);
            this.drawer.guiManager = this.guiManager;
            console.log("= MainView Ready");
        }

    };

    MainView.prototype.storeContext = function(data,name) {
        if(this.guiManager.localstorage_enabled)
            try {
                localStorage[name] = JSON.stringify(data);
            } catch(err) {
                alert("Local storage exhausted.\nThe data will not be cached ("+name+")	");
            }
    };

    MainView.prototype.restoreContext = function() {
        var original_data = JSON.parse(localStorage['last_context_original_data']);
        var peerings = JSON.parse(localStorage['last_context_peerings']);
        var starttime = localStorage['last_context_starttime'].replace(/"/g,'');;
        var endtime = localStorage['last_context_endtime'].replace(/"/g,'');;
        var targets = localStorage['last_context_targets'].replace(/"/g,'');

        this.guiManager.RipeDataBroker.current_starttime = starttime;
        this.guiManager.RipeDataBroker.current_endtime = endtime;
        this.guiManager.RipeDataBroker.current_targets = targets;
        this.guiManager.RipeDataBroker.ipv4_peerings = peerings[4];
        this.guiManager.RipeDataBroker.ipv6_peerings = peerings[6];
        this.guiManager.RipeDataBroker.current_parsed = original_data;
        this.guiManager.RipeDataBroker.loadCurrentState(null,false,null,true);
    };

    MainView.prototype.getLocalParameters = function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

    MainView.prototype.checkRequest = function(){
        var DateConverter = this.guiManager.DateConverter;
        var validator = this.guiManager.validator;
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
                    this.guiManager.RipeDataBroker.current_starttime = start;
                    this.guiManager.RipeDataBroker.current_endtime = end;
                }
                else{
                    throw "wrong dates";
                    request_done = false;
                }
                //targets
                var tgt_list = tgt.split(',');
                if(tgt_list.every(function(e){return validator.check_ipv4(e)||validator.check_ipv6(e)||validator.check_asn(e);}))
                    this.guiManager.RipeDataBroker.current_targets = tgt;
                else{
                    throw "wrong target";
                    request_done = false;
                }
                //type
                if(type)
                    if(type == "stream"||type == "heat")
                        this.guiManager.graph_type = type;
                //level
                if(level){
                    level = parseInt(level);
                    if(!isNaN(level))
                        this.guiManager.asn_level = level;
                }
                //merge cp
                if(merge_cp)
                    if(merge_cp == 'true'|| merge_cp == 'false')
                        this.guiManager.merge_cp = merge_cp == 'true';
                //merge events
                if(merge_events){
                    merge_events = parseInt(merge_events);
                    if(!isNaN(merge_events))
                        this.guiManager.merge_events = merge_events;
                }
                //timemap
                if(timemap)
                    if(timemap == 'true'|| timemap == 'false')
                        this.guiManager.heatmap_time_map = timemap == 'true';
                //global visibility
                if(global_vis)
                    if(global_vis == 'true'|| global_vis == 'false')
                        this.guiManager.global_visibility = global_vis == 'true';
                //gather info
                if(info)
                    if(info == 'true'|| info == 'false')
                        this.guiManager.gather_information = info == 'true';
                //preserve colors
                if(colors)
                    if(colors == 'true'|| colors == 'false')
                        this.guiManager.gather_information = colors == 'true';
                //gather info
                if(info)
                    if(info == 'true'|| info == 'false')
                        this.guiManager.gather_information = info == 'true';
                //brusher
                brush_s = DateConverter.formatRipe(DateConverter.parseRipe(brush_s));
                brush_e = DateConverter.formatRipe(DateConverter.parseRipe(brush_e));
                if(GuiManager.validator.check_date_with_format(brush_s,GuiManager.DateConverter.ripestat_data_format)&&GuiManager.validator.check_date_with_format(brush_e,GuiManager.DateConverter.ripestat_data_format)){
                    this.guiManager.drawer.events_range = [];
                    this.guiManager.drawer.events_range[0] = moment(brush_s);
                    this.guiManager.drawer.events_range[1] = moment(brush_e);
                }
                //heuristic
                if(heuristic)
                    this.guiManager.RipeDataBroker.HeuristicsManager.current_heuristic = heuristic;
                //sort_type
                if(heuristic_sort_type)
                    this.guiManager.RipeDataBroker.HeuristicsManager.current_sort_type = heuristic_sort_type;
                this.guiManager.RipeDataBroker.getData();
                request_done = true;
            }
            catch(e){
                alert(e);
                this.guiManager.RipeDataBroker.current_starttime = null;
                this.guiManager.RipeDataBroker.current_endtime = null;
                this.guiManager.RipeDataBroker.current_targets = null;
            }
        }
        return request_done;
    };

    return MainView;
});