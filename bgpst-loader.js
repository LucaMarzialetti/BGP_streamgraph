/**
 * Some require.js configurations
 */


requirejs.config({
    waitSeconds: 30,
    paths:{
        /* environment */
        "bgpst.env.utils": window.atlas._widgets.bgpst.urls.env + "utils",
        "bgpst.env.config": window.atlas._widgets.bgpst.urls.env + "config",
        "bgpst.env.languages.en": window.atlas._widgets.bgpst.urls.env + "languages/language.eng",

        /* libs */
        "bgpst.lib.require": window.atlas._widgets.bgpst.urls.libs + "require.min",
        "bgpst.lib.jquery-amd": window.atlas._widgets.bgpst.urls.libs + "jquery-libs-amd",
        "bgpst.lib.jquery-libs": window.atlas._widgets.bgpst.urls.libs + "jquery-libs.2",
        "bgpst.lib.date-format": window.atlas._widgets.bgpst.urls.libs + "dateFormat",
        "bgpst.lib.d3-amd": window.atlas._widgets.bgpst.urls.libs + "d3/js/d3.v4.amd",
        "bgpst.lib.mustache": window.atlas._widgets.bgpst.urls.libs + "mustache",
        "bgpst.lib.text": window.atlas._widgets.bgpst.urls.libs + "require-text",
        "bgpst.lib.stache": window.atlas._widgets.bgpst.urls.libs + "stache",
        "bgpst.lib.colorbrewer": window.atlas._widgets.bgpst.urls.libs + "colorbrewer",
        "bgpst.lib.d3.legend": window.atlas._widgets.bgpst.urls.libs + "d3.legend",
        "bgpst.lib.moment": window.atlas._widgets.bgpst.urls.libs + "moment/2.18.1/moment.min",

        "bgpst.lib.bootstrap.datetimepicker": window.atlas._widgets.bgpst.urls.libs + "datetimepicker/4.17.47/bootstrap-datetimepicker.min",
        "bgpst.lib.bootstrap.validator": window.atlas._widgets.bgpst.urls.libs + "form_validator/0.5.3/bootstrapValidator.min",
        "bgpst.lib.bootstrap.validator-it": window.atlas._widgets.bgpst.urls.libs + "form_validator/0.5.3/it_IT",

        "bgpst.lib.bootstrap.tokenfield": window.atlas._widgets.bgpst.urls.libs + "tokenfield/0.12.0/bootstrap-tokenfield.min",



        /* view */
        "bgpst.view.main": window.atlas._widgets.bgpst.urls.view + "MainView",
        "bgpst.view.color": window.atlas._widgets.bgpst.urls.view + "ColorManager",
        "bgpst.view.graphdrawer": window.atlas._widgets.bgpst.urls.view + "GraphDrawer",
        "bgpst.view.gui": window.atlas._widgets.bgpst.urls.view + "GuiManager",
        "bgpst.view.context": window.atlas._widgets.bgpst.urls.view + "ContextManager",
        "bgpst.view.heuristics": window.atlas._widgets.bgpst.urls.view + "HeuristicsManager",
        "bgpst.view.metrics": window.atlas._widgets.bgpst.urls.view + "MetricsManager",
        "bgpst.view.broker": window.atlas._widgets.bgpst.urls.view + "RipeDataBroker",
        "bgpst.view.parser": window.atlas._widgets.bgpst.urls.view + "RipeDataParser",
        "bgpst.view.scroller": window.atlas._widgets.bgpst.urls.view + "Scroller",

        /* controller */
        "bgpst.controller.main": window.atlas._widgets.bgpst.urls.controller + "main",

        "bgpst.controller.asnvalidator": window.atlas._widgets.bgpst.urls.controller + "helpers/AsnValidator",
        "bgpst.controller.dateconverter": window.atlas._widgets.bgpst.urls.controller + "helpers/DateConverter",
        "bgpst.controller.datevalidator": window.atlas._widgets.bgpst.urls.controller + "helpers/DateValidator",
        "bgpst.controller.functions": window.atlas._widgets.bgpst.urls.controller + "helpers/Functions",
        "bgpst.controller.ipv4validator": window.atlas._widgets.bgpst.urls.controller + "helpers/Ipv4Validator",
        "bgpst.controller.ipv6validator": window.atlas._widgets.bgpst.urls.controller + "helpers/Ipv6Validator",
        "bgpst.controller.logger": window.atlas._widgets.bgpst.urls.controller + "helpers/Logger",
        "bgpst.controller.validator": window.atlas._widgets.bgpst.urls.controller + "helpers/Validator",


        /* model */
        "bgpst.model.gdbstruct": window.atlas._widgets.bgpst.urls.model + "gdb_structure/GDBStruct",


        /* connector */
        "bgpst.connector.facade": window.atlas._widgets.bgpst.urls.connector + "ConnectorFacade",
        "bgpst.connector.translation": window.atlas._widgets.bgpst.urls.connector + "TranslationConnector",
        "bgpst.connector.rest": window.atlas._widgets.bgpst.urls.connector + "RestConnector",

    },
    shim:{
        "bgpst.lib.bootstrap-datetimepicker": {
            deps: ["bgpst.lib.jquery-amd"]
        },
        "bgpst.lib.bootstrap-validator": {
            deps: ["bgpst.lib.jquery-amd"]
        },
        "bgpst.lib.bootstrap-validator-it": {
            deps: ["bgpst.lib.jquery-amd"]
        },
        "bgpst.lib.bootstrap-tokenfield": {
            deps: ["bgpst.lib.jquery-amd"]
        }
    },

    stache: {
        extension: '.html', // default = '.html'
        path: 'dev/view/html/' // default = ''
    }
});



define([
    "bgpst.env.utils",
    "bgpst.env.config",
    "bgpst.env.languages.en",
    "bgpst.lib.jquery-amd",
    "bgpst.controller.main",
    "bgpst.view.context"
], function(utils, config, language, $, main, ContextManager){

    return function(instance){
        var env, instanceParams, queryParams, parentDom, styleDownloads, objectToBeEnriched;

        /*
         * Access to the instance
         */
        instanceParams = instance.instanceParams;
        queryParams = instance.queryParams;
        parentDom = instance.domElement;

        /*
         * Init Dependency Injection Vector
         */
        env = {
            "version": "17.10.1.0",
            "dev": instanceParams.dev,
            "widgetUrl": WIDGET_URL + "dev/",
            "parentDom": $(parentDom),
            "queryParams": queryParams
        };

        //window.env = env; // TEMP: just for debugging



        /*
         * Check if parent dom exists
         */
        if (!env.parentDom || env.parentDom.length == 0){
            throw "It was not possible to find the DOM element to populate";
        }


        /*
         * Check if stylesheets are loaded
         */

        if (!instanceParams.dev){
            styleDownloads = [
                window.atlas._widgets.bgpst.urls.view + "css/style-lib-dist.min.css"
            ];
        } else {
            styleDownloads = [
                window.atlas._widgets.bgpst.urls.view + "css/style.css",
                window.atlas._widgets.bgpst.urls.libs + "jquery/jquery-ui.min.css",
                window.atlas._widgets.bgpst.urls.libs + "bootstrap/css/bootstrap.min.css",
                window.atlas._widgets.bgpst.urls.libs + "bootstrap/css/bootstrap-theme.min.css",
                window.atlas._widgets.bgpst.urls.libs + "bootstrap-slider/css/bootstrap-slider.css"
            ];

        }


        objectToBeEnriched = {};

        utils.loadStylesheets(styleDownloads, function(){
            var n, length, methodName, callbackReady;

            env.main = new main(env);

            if (env.autoStart){
                env.main.init();
            }

            function enrichMethod(methodName) {
                objectToBeEnriched[methodName] = function () {
                    return env.main[methodName].apply(env.main, arguments);
                }
            }

            for (n=0,length=env.main.exposedMethods.length; n<length; n++){
                methodName = env.main.exposedMethods[n];
                enrichMethod(methodName);
            }

            callbackReady = window.atlas._widgets.bgpst.instances.callback[parentDom];

            /* bgp stream script to ben run */

            $(".jquery_ui_spinner").spinner();
            $("button").button();
            context_manager = new ContextManager();
            //draw in the svg
            context_manager.drawer.drawer_init();
            //setup the gui
            context_manager.GuiManager.gui_setup();

            //resize listener
            $(window).resize(function(){
                context_manager.drawer.drawer_init();
                if(context_manager.GuiManager.isGraphPresent){
                    if(context_manager.GuiManager.graph_type=="stream")
                        context_manager.drawer.draw_streamgraph(
                            context_manager.RipeDataBroker.current_parsed,
                            context_manager.GuiManager.graph_type,
                            context_manager.GuiManager.RipeDataBroker.current_asn_tsv, 
                            context_manager.GuiManager.drawer.keys, 
                            context_manager.GuiManager.preserve_map, 
                            context_manager.GuiManager.RipeDataBroker.current_visibility, 
                            context_manager.GuiManager.RipeDataBroker.current_parsed.targets, 
                            context_manager.GuiManager.RipeDataBroker.current_parsed.query_id, 
                            function(pos){return context_manager.GuiManager.RipeDataBroker.go_to_bgplay(
                                context_manager.GuiManager.RipeDataBroker.current_starttime,
                                context_manager.GuiManager.RipeDataBroker.current_endtime,
                                context_manager.GuiManager.RipeDataBroker.current_targets,
                                pos)},
                            null,
                            null,
                            true);                      
                    else
                        if(context_manager.GuiManager.graph_type=="heat")
                            context_manager.GuiManager.drawer.draw_heatmap(
                                context_manager.GuiManager.RipeDataBroker.current_parsed,
                                context_manager.GuiManager.RipeDataBroker.current_cp_tsv,
                                context_manager.GuiManager.RipeDataBroker.current_asn_tsv, 
                                context_manager.GuiManager.drawer.keys, 
                                context_manager.GuiManager.preserve_map, 
                                context_manager.GuiManager.RipeDataBroker.current_visibility, 
                                context_manager.GuiManager.RipeDataBroker.current_parsed.targets, 
                                context_manager.GuiManager.RipeDataBroker.current_parsed.query_id, 
                                function(pos){return RipeDataBroker.go_to_bgplay(
                                    context_manager.GuiManager.RipeDataBroker.current_starttime,
                                    context_manager.GuiManager.RipeDataBroker.current_endtime,
                                    context_manager.GuiManager.RipeDataBroker.current_targets,pos)}, 
                                context_manager.GuiManager.asn_level, 
                                context_manager.GuiManager.ip_version, 
                                context_manager.GuiManager.prepending_prevention, 
                                context_manager.GuiManager.merge_cp, 
                                context_manager.GuiManager.merge_events, 
                                context_manager.GuiManager.events_labels, 
                                context_manager.GuiManager.cp_labels,
                                context_manager.GuiManager.heatmap_time_map,
                                null,
                                true);
                    }
                })
            if(!context_manager.check_request())
                context_manager.GuiManager.toggleLoader();         
            
            /** end to be run **/

            if (callbackReady){
                callbackReady(objectToBeEnriched);
            }
        });


        /**
         * A set of methods exposed outside
         */
        return objectToBeEnriched;
    };

});

