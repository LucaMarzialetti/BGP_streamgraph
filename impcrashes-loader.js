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
        "bgpst.lib.jquery-libs": window.atlas._widgets.bgpst.urls.libs + "jquery-libs",
        "bgpst.lib.date-format": window.atlas._widgets.bgpst.urls.libs + "dateFormat",
        "bgpst.lib.d3-amd": window.atlas._widgets.bgpst.urls.libs + "d3/js/d3.v4.amd",
        "bgpst.lib.mustache": window.atlas._widgets.bgpst.urls.libs + "mustache",
        "bgpst.lib.text": window.atlas._widgets.bgpst.urls.libs + "require-text",
        "bgpst.lib.stache": window.atlas._widgets.bgpst.urls.libs + "stache",
        "bgpst.lib.colorbrewer": window.atlas._widgets.bgpst.urls.libs + "colorbrewer",
        "bgpst.lib.d3.legend": window.atlas._widgets.bgpst.urls.libs + "d3.legend",



        /* view */
        "bgpst.view.main": window.atlas._widgets.bgpst.urls.view + "MainView",
        "bgpst.view.color": window.atlas._widgets.bgpst.urls.view + "ColorManager",


        /* controller */
        "bgpst.controller.main": window.atlas._widgets.bgpst.urls.controller + "main",



        /* connector */
        "bgpst.connector.facade": window.atlas._widgets.bgpst.urls.connector + "ConnectorFacade",
        "bgpst.connector.translation": window.atlas._widgets.bgpst.urls.connector + "TranslationConnector",
        "bgpst.connector.rest": window.atlas._widgets.bgpst.urls.connector + "RestConnector",

    },
    shim:{

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
    "bgpst.controller.main"
], function(utils, config, language, $, main){

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

        window.env = env; // TEMP: just for debugging



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
                window.atlas._widgets.bgpst.urls.libs + "bootstrap-slider/css/bootstrap-slider.css",
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

