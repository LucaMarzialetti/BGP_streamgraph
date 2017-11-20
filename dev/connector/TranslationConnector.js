/**
 * TranslationConnector enriches and adapts the external data format to the internal one.
 * It works as a proxy stopping propagation of data format changes in a lower-level of the stack.
 */

define([
    "bgpst.env.config",
    "bgpst.env.utils",
    "bgpst.lib.jquery-amd",
    "bgpst.connector.rest"

], function(config, utils, $, Connector) {


    var TranslationConnector = function () {

        var connector = new Connector();

        var translateToInternalFormat = function (data) {
            var maxValue, minValue;

            // The data provided uses numbers as keys of a dictionary together with other keys.
            // It would be better to use an array with an item for each year or a dedicated sub dictionary.
            data.maxYear = 2014;
            data.minYear = 2010;

            maxValue = -Infinity;
            minValue = Infinity;

            data.features.forEach(function (feature) {
                var goingUp, goingDown, extra, prevValue;

                extra = {};
                goingUp = true;
                goingDown = true;
                for (var year=data.minYear; year <= data.maxYear; year++){
                    var value = parseInt(feature.properties[year]) || 0;
                    extra[year] = value;
                    delete feature.properties[year];

                    if (prevValue !== undefined){
                        if (prevValue > value){
                            goingUp = false;
                        }

                        if (prevValue < value){
                            goingDown = false;
                        }
                    }

                    prevValue = value;
                }

                maxValue = Math.max(maxValue, feature.properties.total);
                minValue = Math.min(minValue, feature.properties.total);
                feature.properties.extra = extra;

                if (goingUp != goingDown && feature.properties.total > 1) {
                    feature.properties.up = goingUp;
                    feature.properties.down = goingDown;
                }

            });

            data.maxValue = maxValue;
            data.minValue = minValue;

            return data;
        };

        this.getData = function () {//parameters
            var deferredCall;

            deferredCall = $.Deferred();

            try {
                var calls = [];

                var call1 = connector
                    .getData()
                    .done(function (json) {
                        // intermediate
                    });

                calls.push(call1);

                $.when.apply(this, args).done(function(){
                    deferredCall.resolve(json);
                });

            } catch(error) {
                deferredCall.reject(error);
            }

            return deferredCall.promise();
        }

    };

    return TranslationConnector;

});

