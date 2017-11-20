/**
 * ConnectorFacade is the singleton Facade of the whole connector level.
 * It provides high-level DAO functions.
 */

define([
    "bgpst.env.config",
    "bgpst.lib.jquery-amd",
    "bgpst.env.utils",
    "bgpst.connector.translation"
], function(config, $, utils, TranslateConnector){

    var ConnectorFacade = function (env) {
        var connector = new TranslateConnector(env);

        this.getData = connector.getData //parameters in translateconn.
    };

    return ConnectorFacade;

});

