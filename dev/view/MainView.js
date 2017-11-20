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
    "bgpst.env.utils",
    "bgpst.env.config",
    "bgpst.env.languages.en",
    "bgpst.lib.jquery-amd",
    "bgpst.lib.d3-amd",
    "bgpst.lib.stache!main",
    "bgpst.lib.stache!error",
    "bgpst.lib.stache!table",
    "bgpst.view.map",
    "bgpst.view.table",
    "bgpst.view.bar-chart"
], function(utils, config, lang, $, d3, template, errorTemplate, tableTemplate, MapView, TableView, BarChartView){

    var MainView = function(env){
        var components, currentStatus, timeRange;

        this.lang = lang;
        timeRange = {
            min: null,
            max: null
        };

        // Views
        components = [new MapView(env), new TableView(env), new BarChartView(env)];

        // listening for changes of time range
        utils.observer.subscribe("time.change", function(range){
            timeRange.min = range[0];
            timeRange.max = range[1];

            currentStatus = this.getCurrentStatus(currentStatus.data);

            this.update();

            this.slider
                .bootstrapSlider('setValue', range.map(function (n) {
                    return parseInt(n);
                }));

            env.parentDom
                .find(".value-slider-stop")
                .text(range[1]);

            env.parentDom
                .find(".value-slider-start")
                .text(range[0]);

        }, this);

        // Filters the dataset according to the new selection
        this.getCurrentStatus = function (data) {
            var domain, colorRange, getCurrentTotal;

            timeRange = {
                    min: timeRange.min || data.minYear,
                    max: timeRange.max || data.maxYear
            };

            getCurrentTotal = function (element, minYear, maxYear) {
                var total = 0;
                for (var year=minYear; year <= maxYear; year++){
                    total += element.properties.extra[year];
                }

                return total;
            };

            // Set the value for the current selected time range
            data
                .features
                .forEach(function (feature) {
                    feature.properties.currentTotal = getCurrentTotal(feature, timeRange.min, timeRange.max);
                });

            data
                .features
                .sort(function (a, b) {
                    return b.properties.currentTotal - a.properties.currentTotal;
                });

            data.maxValue = data.features[0].properties.currentTotal;

            domain = [0, data.maxValue];
            colorRange = config.style.colorRange;

            this.timeRange = timeRange;
            return {
                data: data,
                domain: domain,
                colorRange: colorRange,
                minYear: timeRange.min,
                maxYear: timeRange.max
            };
        };


//what initialize the view and buttons
        this.init = function (data) {
            currentStatus = this.getCurrentStatus(data);

            // Init dom by appending generated template (mustachejs)
            env.parentDom
                .addClass("bgpst-container")
                .html(template(this));

            // Initialise the time slider
            this.slider = env.parentDom
                .find(".slider")
                .bootstrapSlider({
                    value: [currentStatus.minYear, currentStatus.maxYear],
                    step: 1,
                    min: currentStatus.minYear,
                    max: currentStatus.maxYear,
                    tooltip: 'hide'
                })
                .on("slide", function (slideEvt) {
                    env.main.setTimeRange(slideEvt.value[0], slideEvt.value[1]);
                });

            components
                .forEach(function (component) {
                    component.render(currentStatus);
                });
        }.bind(this);


        // Update the views
        this.update = function () {
            components
                .forEach(function (component) {
                    component.render(currentStatus);
                });
        }


    };


    return MainView;
});