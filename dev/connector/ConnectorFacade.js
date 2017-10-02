/**
 * ConnectorFacade is the singleton Facade of the whole connector level.
 * It provides high-level DAO functions.
 */

define([
    "impcrashes.env.config",
    "impcrashes.lib.jquery-amd",
    "impcrashes.env.utils",
    "impcrashes.connector.translation"
], function(config, $, utils, TranslateConnector){

    var ConnectorFacade = function (env) {
        var connector = new TranslateConnector(env);

        this.getData = connector.getData
    };

    return ConnectorFacade;

});

