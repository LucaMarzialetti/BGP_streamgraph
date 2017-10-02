/**
 * RestConnector interfaces with the REST API.
 */

define([
    "impcrashes.env.config",
    "impcrashes.env.utils",
    "impcrashes.lib.jquery-amd"
], function(config, utils, $) {

    var RestConnector = function (env) {

        this.getData = function () {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.main,
                data: {}
            });
        }
    };

    return RestConnector;

});

