define([
    "bgpst.env.config",
    "bgpst.env.utils",
    "bgpst.lib.jquery-amd",
    "bgpst.connector.facade",
    "bgpst.view.main"
], function(config, utils, $, Connector, MainView) {

    var main = function (env) {
        this.exposedMethods = ["getVersion", "on", "init", "applyConfiguration", "setTimeRange"];

        this.setTimeRange = function (startYear, stopYear) {
            utils.observer.publish("time.change", [startYear, stopYear]);
        };

        this.getVersion = function(){
            return env.version;
        };

        this.on = function(event, callback){
            utils.observer.subscribe(event, callback, this);
        };

        this.init = function(){
            env.connector = new Connector(env);
            env.mainView = new MainView(env);

            env.connector
                .getData()
                .done(env.mainView.init)
                .fail(function (error) {
                    console.log(error); // This has to be improved...
                });
        };


        this.init();

    };

    return main;
});