/**
 * RestConnector interfaces with the REST API.
 */

define([
    "bgpst.env.config",
    "bgpst.env.utils",
    "bgpst.lib.jquery-amd"
], function(config, utils, $) {

    var RestConnector = function (env) {

        // call bgplay api
        this.getBGPHistory = function (startTimestamp, stopTimestamp, resource) {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.main,
                data: {
                    starttime: startTimestamp,
                    endtime: stopTimestamp,
                    resource: resource
                }
            });
        }

        // call peer count api
        this.getBGPCount = function (startTimestamp,stopTimestamp) {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.count,
                data: {
                    starttime: startTimestamp,
                    endtime: stopTimestamp,
                }
            });
        }

        // call geoloc api for collector peer info
        this.getCPInfo = function (resource) {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.cpInfo,
                data: {
                    resource: resource
                }
            });
        }

        // call as overview api 
        this.getASInfo = function (resource) {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.asInfo,
                data: {
                    resource: resource
                }
            });
        }

        // call external api for get visitor ip
        this.getASInfo = function () {

            console.log("REST query");

            return $.ajax({
                dataType: "json",
                url: config.dataAPIs.ipInfo,
                data: {
                }
            });
        }
    };

    return RestConnector;

});