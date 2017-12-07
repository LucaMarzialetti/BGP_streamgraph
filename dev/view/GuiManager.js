define([
    "bgpst.view.graphdrawer",
    "bgpst.controller.validator",
    "bgpst.controller.dateconverter",
    "bgpst.view.broker",
    "bgpst.view.scroller",
    "bgpst.lib.moment",
    "bgpst.lib.jquery-amd",
    "bgpst.lib.stache!main"
], function(GraphDrawer, Validator, DateConverter, RipeDataBroker, EPPZScrollTo, moment, $, template){


    //setup the whole gui interface actions, events and styles <-- TO CALL AT DOM READY
    var GuiManager = function(env) {

        var $this = this;
        /*************************************** DOM elements ************************************/
        env.parentDom.append(template());

        this.dom = {
            container: env.parentDom.find("div.body_container"), //unsed?
            heatmapTimeButton: env.parentDom.find(".heatmap_time_btn"),
            pathButton: env.parentDom.find(".path_btn"),
            listButton: env.parentDom.find(".list_btn"),
            sortButton: env.parentDom.find(".sort_btn"),
            optionCommandButton: env.parentDom.find(".option_command_btn"),
            clearTargetsButton: env.parentDom.find(".clear_targets_button"),
            myIpButton: env.parentDom.find(".my_ip_button"),
            goButton: env.parentDom.find(".go_button"),
            date: env.parentDom.find(".date"),
            graphType : env.parentDom.find("input[name='graph_type']"),
            ipVersion6Button : env.parentDom.find("input[name='ip_version'][value='6']").parent(),
            ipVersion4Button : env.parentDom.find("input[name='ip_version'][value='4']").parent(),
            stepsButton : env.parentDom.find("input[name='steps'][value='steps']").parent(),
            streamingButton : env.parentDom.find("input[name='streaming'][value='streaming']").parent(),
            streaming_Button : env.parentDom.find(".streaming_btn"),
            gatherInformationButton : env.parentDom.find(".gather_information_btn"),
            preserveColorButton : env.parentDom.find(".preserve_color_btn"),
            globalVisibilityButton : env.parentDom.find(".global_visibility_btn"),
            prependingPreventionButton : env.parentDom.find(".prepending_prevention_btn"),
            mergeCPButton : env.parentDom.find(".merge_cp_btn"),
            eventsLabelsButton : env.parentDom.find(".events_labels_btn"),
            cpLabelsButton : env.parentDom.find(".cp_labels_btn"),
            scrollbarsButton : env.parentDom.find(".scrollbars_btn"),

            heatOptionButton : env.parentDom.find(".scrollbars_btn"),
            streamOptionButton : env.parentDom.find(".scrollbars_btn"),
            asnLvlButton : env.parentDom.find(".scrollbars_btn"),
            mergeEventsButton : env.parentDom.find(".scrollbars_btn"),
            graphTypeStream : env.parentDom.find(".scrollbars_btn"),
            graphTypeHeat : env.parentDom.find(".scrollbars_btn"),
            Ipve : env.parentDom.find(".scrollbars_btn"),
            scrollbarsButton : env.parentDom.find(".scrollbars_btn"),



// .heat_option
// .stream_option
// .asn_lvl
// .merge_events
// input[name="graph_type"][value="stream"]
// input[name="graph_type"][value="heat"]
// input[name="ip_version"][value="4"]
// input[name="ip_version"][value="6"]

        };
        this.drawer = new GraphDrawer(env);

        this.preserve_map = true;
        this.global_visibility = true;
        this.prepending_prevention = true;
        this.asn_level = 1;
        this.ip_version = [4];
        this.graph_type = "stream";
        this.streaming = false;
        this.steps = false;
        this.merge_cp = false;
        this.merge_events = 1;
        this.events_labels = false;
        this.cp_labels = false;
        this.use_scrollbars = false;
        this.cp_info_done = false;
        this.asn_info_done = false;
        this.gather_information = true;
        this.heatmap_time_map = true;
        this.streaming_speed = 10000;

        this.init = function () {
            this.ripeDataBroker = new RipeDataBroker(env);
            this.validator = new Validator();
            this.dateConverter = new DateConverter();

            this.drawer.drawer_init();
            this.pickers_setup();
            this.other_command_button_setup();
            this.tooltip_setup();

            this.ripeDataBroker.getData();
        };

        this.pickers_setup = function () {
            // nothing for now
        };

        //other_command_menu
        this.other_command_button_setup = function () {
            this.shuffle_color_map_btn_setup();
            this.erase_graph_btn_setup();
            this.gather_information_btn_setup();
            this.preserve_color_map_btn_setup();
            this.prepending_prevention_btn_setup();
            this.merge_events_btn_setup();
            this.merge_cp_btn_setup();
            this.events_labels_btn_setup();
            this.cp_labels_btn_setup();
            this.scrollbars_btn_setup();
            this.heatmap_time_btn_setup();
            this.global_visiblity_btn_setup();
            this.graph_type_radio_setup();
            this.ip_version_checkbox_setup();
            this.asn_level_setup();
            this.streaming_btn_setup();
            this.steps_btn_setup();
            this.asn_list_btn_setup();
            this.cp_list_btn_setup();
            /***********************************************/
            this.boolean_checker();
            /***********************************************/
            this.sort_asn_ascstdev_btn_setup();
            this.sort_asn_dscstdev_btn_setup();
            this.sort_asn_ascvar_btn_setup();
            this.sort_asn_dscvar_btn_setup();
            this.sort_asn_ascavg_btn_setup();
            this.sort_asn_dscavg_btn_setup();
            this.sort_asn_ascsum_btn_setup();
            this.sort_asn_dscsum_btn_setup();
            this.lev_dist_randwalk_cum_btn_setup();
            this.lev_dist_randwalk_max_btn_setup();
            this.point_dist_by_randwalk_btn_setup();
            this.point_dist_by_inference_btn_setup();
            this.point_dist_greedy_btn_setup();
            this.exchange_greedy_sort_btn_setup();
            this.wiggle_max_btn_setup();
            this.wiggle_sum_btn_setup();
            /**********************************************/
            this.heat_greedy_sort_1_btn_setup();
            this.heat_greedy_sort_2_btn_setup();
            this.heat_stdev_sort_btn_setup();
            this.heat_geo_sort_btn_setup();
            this.heat_asn_sort_btn_setup();
            this.draw_functions_btn_enabler();
            /**********************************************/
            this.docs_btn_setup();
            this.about_btn_setup();
            this.embed_btn_setup();
        };


        this.isGraphPresent = function (text) {
            //return d3.select("svg").select(".chart").node() != null;
            return this.drawer.isGraphPresent();
        };

        this.lock_all = function () {
            this.dom.pathButton.addClass("disabled");
            this.dom.listButton.addClass("disabled");
            this.dom.sortButton.addClass("disabled");
            this.dom.optionCommandButton.addClass("disabled");
            this.dom.clearTargetsButton.addClass("disabled");
            this.dom.myIpButton.addClass("disabled");
            this.dom.goButton.addClass("disabled");
            this.dom.date.addClass("disabled");

            this.dom.pathButton.addClass("not-active");
            this.dom.listButton.addClass("not-active");
            this.dom.sortButton.addClass("not-active");
            this.dom.optionCommandButton.addClass("not-active");
            this.dom.clearTargetsButton.addClass("not-active");
            this.dom.myIpButton.addClass("not-active");
            this.dom.goButton.addClass("not-active");
            this.dom.date.addClass("not-active");

            this.dom.graphType.parent().addClass("disabled");
            this.dom.graphType.parent().addClass("not-active");
            this.dom.graphType.parent().attr("disabled", true);

            this.dom.ipVersion6Button.addClass("disabled");
            this.dom.ipVersion6Button.addClass("not-active");
            this.dom.ipVersion6Button.attr("disabled", true);

            this.dom.ipVersion4Button.addClass("disabled");
            this.dom.ipVersion4Button.addClass("not-active");
            this.dom.ipVersion4Button.attr("disabled", true);

            this.dom.stepsButton.addClass("disabled");
            this.dom.stepsButton.addClass("not-active");
            this.dom.stepsButton.attr("disabled", true);
            $(".steps_btn").addClass("not-active");

            if (!this.streaming) {
                this.dom.streamingButton.addClass("disabled");
                this.dom.streamingButton.addClass("not-active");
                this.dom.streamingButton.attr("disabled", true);
                this.dom.streaming_Button.addClass("not-active");
            }
        };
    
        this.boolean_checker = function () {
            if (!this.gather_information) {
                this.dom.gatherInformationButton.find("span").addClass("hidden");
                this.dom.gatherInformationButton.parent().removeClass("active");
            }
            else {
                this.dom.gatherInformationButton.find("span").removeClass("hidden");
                this.dom.gatherInformationButton.parent().addClass("active");
            }

            if (!this.preserve_map) {
                this.dom.preserveColorButton.find("span").addClass("hidden");
                this.dom.preserveColorButton.parent().removeClass("active");
            }
            else {
                this.dom.preserveColorButton.find("span").removeClass("hidden");
                this.dom.preserveColorButton.parent().addClass("active");
            }

            if (!this.global_visibility) {
                this.dom.globalVisibilityButton.find("span").addClass("hidden");
                this.dom.globalVisibilityButton.parent().removeClass("active");
            }
            else {
                this.dom.globalVisibilityButton.find("span").removeClass("hidden");
                this.dom.globalVisibilityButton.parent().addClass("active");
            }

            if (!this.prepending_prevention) {
                this.dom.prependingPreventionButton.find("span").addClass("hidden");
                this.dom.prependingPreventionButton.parent().removeClass("active");
            }
            else {
                this.dom.prependingPreventionButton.find("span").removeClass("hidden");
                this.dom.prependingPreventionButton.parent().addClass("active");
            }

            if (!this.merge_cp) {
                this.dom.mergeCPButton.find("span").addClass("hidden");
                this.dom.mergeCPButton.parent().removeClass("active");
            }
            else {
                this.dom.mergeCPButton.find("span").removeClass("hidden");
                this.dom.mergeCPButton.parent().addClass("active");
            }

            if (!this.events_labels) {
                this.dom.eventsLabelsButton.find("span").addClass("hidden");
                this.dom.eventsLabelsButton.parent().removeClass("active");
            }
            else {
                this.dom.eventsLabelsButton.find("span").removeClass("hidden");
                this.dom.eventsLabelsButton.parent().addClass("active");
            }

            if (!this.cp_labels) {
                this.dom.cpLabelsButton.find("span").addClass("hidden");
                this.dom.cpLabelsButton.parent().removeClass("active");
            }
            else {
                this.dom.cpLabelsButton.find("span").removeClass("hidden");
                this.dom.cpLabelsButton.parent().addClass("active");
            }

            if (!this.heatmap_time_map) {
                this.dom.heatmapTimeButton.find("span").addClass("hidden");
                this.dom.heatmapTimeButton.parent().removeClass("active");
            }
            else {
                this.dom.heatmapTimeButton.find("span").removeClass("hidden");
                this.dom.heatmapTimeButton.parent().addClass("active");
            }

            if (!this.use_scrollbars) {
                this.dom.scrollbarsButton.find("span").addClass("hidden");
                this.dom.scrollbarsButton.parent().removeClass("active");
            }
            else {
                this.dom.scrollbarsButton.find("span").removeClass("hidden");
                this.dom.scrollbarsButton.parent().addClass("active");
            }
            if (this.graph_type == "stream") {
                $('input[name="graph_type"][value="stream"]').prop('checked', true);
                $('input[name="graph_type"][value="stream"]').parent().addClass("active");
                $('input[name="graph_type"][value="heat"]').parent().removeClass("active");
                $(".stream_option").removeClass("hidden");
                $(".heat_option").addClass("hidden");
            }
            else if (this.graph_type == "heat") {
                $('input[name="graph_type"][value="heat"]').prop('checked', true);
                $('input[name="graph_type"][value="heat"]').parent().addClass("active");
                $('input[name="graph_type"][value="stream"]').parent().removeClass("active");
                $(".heat_option").removeClass("hidden");
                $(".stream_option").addClass("hidden");
            }
            if (this.ip_version.indexOf(4) != -1) {
                $('input[name="ip_version"][value="4"]').prop('checked', true);
                $('input[name="ip_version"][value="4"]').parent().addClass("active");
            }
            if (this.ip_version.indexOf(6) != -1) {
                $('input[name="ip_version"][value="6"]').prop('checked', true);
                $('input[name="ip_version"][value="6"]').parent().addClass("active");
            }

            $(".asn_lvl").spinner();
            $(".asn_lvl").spinner("value", this.asn_level);
            $(".merge_events").spinner();
            $(".merge_events").spinner("value", this.merge_events);
        };

        this.draw_functions_btn_enabler = function () {
            if (!this.streaming) {
                this.dom.optionCommandButton.removeClass("disabled");
                this.dom.myIpButton.removeClass("disabled");
                this.dom.goButton.removeClass("disabled");
                this.dom.date.removeClass("disabled");

                this.dom.optionCommandButton.removeClass("not-active");
                this.dom.myIpButton.removeClass("not-active");
                this.dom.goButton.removeClass("not-active");
                this.dom.date.removeClass("not-active");

                this.dom.graphType.parent().removeClass("disabled");
                this.dom.graphType.parent().removeClass("not-active");
                this.dom.graphType.parent().attr("disabled", false);

                if (this.isGraphPresent()) {
                    this.dom.pathButton.removeClass("disabled");
                    this.dom.listButton.removeClass("disabled");
                    this.dom.sortButton.removeClass("disabled");
                    this.dom.pathButton.removeClass("not-active");
                    this.dom.listButton.removeClass("not-active");
                    this.dom.sortButton.removeClass("not-active");
                    if (!this.ripeDataBroker.current_parsed.targets.some(function (e) {
                            return $this.validator.check_ipv4(e);
                        })) {
                        this.dom.ipVersion4Button.addClass("disabled");
                        this.dom.ipVersion4Button.addClass("not-active");
                        this.dom.ipVersion4Button.attr("disabled", true);
                    }
                    else {
                        this.dom.ipVersion4Button.removeClass("disabled");
                        this.dom.ipVersion4Button.removeClass("not-active");
                        this.dom.ipVersion4Button.attr("disabled", false);
                    }
                    if (!this.ripeDataBroker.current_parsed.targets.some(function (e) {
                            return $this.validator.check_ipv6(e);
                        })) {
                        this.dom.ipVersion6Button.addClass("disabled");
                        this.dom.ipVersion6Button.addClass("not-active");
                        this.dom.ipVersion6Button.attr("disabled", true);
                    }
                    else {
                        this.dom.ipVersion6Button.removeClass("disabled");
                        this.dom.ipVersion6Button.removeClass("not-active");
                        this.dom.ipVersion6Button.attr("disabled", false);
                    }
                    if (this.ip_version.indexOf(4) != -1) {
                        $('input[name="ip_version"]').filter('[value="4"]').prop('checked', true);
                        $('input[name="ip_version"]').filter('[value="4"]').parent().addClass("active");
                    }
                    else {
                        $('input[name="ip_version"]').filter('[value="4"]').prop('checked', false);
                        $('input[name="ip_version"]').filter('[value="4"]').parent().removeClass("active");
                    }
                    if (this.ip_version.indexOf(6) != -1) {
                        $('input[name="ip_version"]').filter('[value="6"]').prop('checked', true);
                        $('input[name="ip_version"]').filter('[value="6"]').parent().addClass("active");
                    }
                    else {
                        $('input[name="ip_version"]').filter('[value="6"]').prop('checked', false);
                        $('input[name="ip_version"]').filter('[value="6"]').parent().removeClass("active");
                    }
                    $(".counter").removeClass("hidden");
                    if (this.graph_type == "stream") {
                        this.dom.stepsButton.removeClass("disabled");
                        this.dom.stepsButton.removeClass("not-active");
                        this.dom.stepsButton.attr("disabled", false);
                        $(".steps_btn").removeClass("not-active");

                        this.dom.streamingButton.removeClass("disabled");
                        this.dom.streamingButton.removeClass("not-active");
                        this.dom.streamingButton.attr("disabled", false);
                        this.dom.streaming_Button.removeClass("not-active");
                    }
                    if (this.graph_type == "heat") {
                        this.dom.stepsButton.addClass("disabled");
                        this.dom.stepsButton.addClass("not-active");
                        this.dom.stepsButton.attr("disabled", true);
                        $(".steps_btn").addClass("not-active");

                        this.dom.streamingButton.addClass("disabled");
                        this.dom.streamingButton.addClass("not-active");
                        this.dom.streamingButton.attr("disabled", true);
                        this.dom.streaming_Button.addClass("not-active");
                    }
                    if (!this.steps) {
                        $('input[name="steps"][value="steps"]').prop('checked', false);
                        $('input[name="steps"][value="steps"]').parent().removeClass("active");
                    }
                }
                else {
                    this.dom.pathButton.addClass("disabled");
                    this.dom.listButton.addClass("disabled");
                    this.dom.sortButton.addClass("disabled");
                    this.dom.pathButton.addClass("not-active");
                    this.dom.listButton.addClass("not-active");
                    this.dom.sortButton.addClass("not-active");

                    this.dom.ipVersion6Button.addClass("disabled");
                    this.dom.ipVersion6Button.addClass("not-active");
                    this.dom.ipVersion6Button.attr("disabled", true);

                    this.dom.ipVersion4Button.addClass("disabled");
                    this.dom.ipVersion4Button.addClass("not-active");
                    this.dom.ipVersion4Button.attr("disabled", true);

                    $(".counter").addClass("hidden");

                    this.dom.stepsButton.addClass("disabled");
                    this.dom.stepsButton.addClass("not-active");
                    this.dom.stepsButton.attr("disabled", true);
                    $(".steps_btn").addClass("not-active");

                    this.dom.streamingButton.addClass("disabled");
                    this.dom.streamingButton.addClass("not-active");
                    this.dom.streamingButton.attr("disabled", true);
                    this.dom.streaming_Button.addClass("not-active");
                }
            }
        };

        this.ip_version_checkbox_enabler = function () {
            GuiManager = this;
            if (!this.streaming) {
                if (this.ripeDataBroker.current_parsed.targets.every(function (e) {
                        return GuiManager.validator.check_ipv4(e);
                    })) {
                    this.dom.ipVersion4Button.removeClass("disabled");
                    this.dom.ipVersion4Button.removeClass("not-active");
                    this.dom.ipVersion4Button.attr("disabled", false);
                    this.ip_version = [4];
                }
                else {
                    this.dom.ipVersion4Button.addClass("disabled");
                    this.dom.ipVersion4Button.addClass("not-active");
                    this.dom.ipVersion4Button.attr("disabled", true);
                }
                if (this.ripeDataBroker.current_parsed.targets.every(function (e) {
                        return GuiManager.validator.check_ipv6(e);
                    })) {
                    this.dom.ipVersion6Button.removeClass("disabled");
                    this.dom.ipVersion6Button.removeClass("not-active");
                    this.dom.ipVersion6Button.attr("disabled", false);
                    this.ip_version = [6];
                }
                else {
                    this.dom.ipVersion6Button.addClass("disabled");
                    this.dom.ipVersion6Button.addClass("not-active");
                    this.dom.ipVersion6Button.attr("disabled", true);
                }
                if (this.ripeDataBroker.current_parsed.targets.some(function (e) {
                        return GuiManager.validator.check_ipv4(e);
                    }) && this.ripeDataBroker.current_parsed.targets.some(function (e) {
                        return GuiManager.validator.check_ipv6(e);
                    })) {
                    this.dom.ipVersion4Button.removeClass("disabled");
                    this.dom.ipVersion4Button.removeClass("not-active");
                    this.dom.ipVersion4Button.attr("disabled", false);
                    this.dom.ipVersion6Button.removeClass("disabled");
                    this.dom.ipVersion6Button.removeClass("not-active");
                    this.dom.ipVersion6Button.attr("disabled", false);
                    if (this.ip_version.length == 0)
                        this.ip_version = [4];
                }
            }
        };

   
        /************************** CLICKABLE UI SETUP **************************/
        //TO CALL AT SETUP
        
        this.tooltip_setup = function () {
            $('[data-toggle="tooltip"]').tooltip();
        };

        this.shuffle_color_map_btn_setup = function () {
            var GuiManager = this;
            $(".shuffle_color_map_btn").on("click", function (e) {
                if (GuiManager.isGraphPresent())
                    GuiManager.drawer.shuffle_color_map(GuiManager.graph_type);
            });
        };

        this.erase_graph_btn_setup = function () {
            var GuiManager = this;
            $(".erase_graph_btn").on("click", function (e) {
                GuiManager.drawer.drawer_init();
                GuiManager.draw_functions_btn_enabler();
            });
        };

        this.gather_information_btn_setup = function () {
            this.dom.gatherInformationButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                $this.gather_information = !$this.gather_information;
            });
        };

        this.preserve_color_map_btn_setup = function () {
            var GuiManager = this;
            this.dom.preserveColorButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.preserve_map = !GuiManager.preserve_map;
                // GuiManager.url_string();
            });
        };

        this.prepending_prevention_btn_setup = function () {
            this.dom.prependingPreventionButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                $this.prepending_prevention = !$this.prepending_prevention;
                if ($this.isGraphPresent())
                    if ($this.graph_type == "stream")
                        $this.ripeDataBroker.loadCurrentState(false, null, true);
                    else if ($this.graph_type == "heat")
                        $this.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.merge_cp_btn_setup = function () {
            var GuiManager = this;
            this.dom.mergeCPButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.merge_cp = !GuiManager.merge_cp;
                if (GuiManager.isGraphPresent()) {
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                    if (GuiManager.merge_cp)
                        GuiManager.update_counters(".counter_asn", GuiManager.drawer.keys.length + "/" + GuiManager.ripeDataBroker.current_parsed.cp_set.length);
                    else
                        GuiManager.update_counters(".counter_asn", GuiManager.drawer.keys.length);
                }
            });
        };

        this.merge_events_btn_setup = function () {
            var GuiManager = this;
            $("input[name='merge_events']:input").on("change", function (e, ui) {
                GuiManager.merge_events = $("input[name='merge_events']").spinner("value");
                if (GuiManager.isGraphPresent()) {
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                    if (GuiManager.merge_events)
                        GuiManager.update_counters(".counter_events", GuiManager.drawer.event_set.length + "/" + GuiManager.ripeDataBroker.current_parsed.events.length);
                    else
                        GuiManager.update_counters(".counter_events", GuiManager.ripeDataBroker.current_parsed.events.length);
                }
            });
        };

        this.events_labels_btn_setup = function () {
            var GuiManager = this;
            this.dom.eventsLabelsButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.events_labels = !GuiManager.events_labels;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, false);
            });
        };

        this.cp_labels_btn_setup = function () {
            var GuiManager = this;
            this.dom.cpLabelsButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.cp_labels = !GuiManager.cp_labels;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, false);
            });
        };

        this.heatmap_time_btn_setup = function () {
            var GuiManager = this;
            this.dom.heatmapTimeButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.heatmap_time_map = !GuiManager.heatmap_time_map;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.scrollbars_btn_setup = function () {
            var GuiManager = this;
            this.dom.scrollbarsButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.use_scrollbars = !GuiManager.use_scrollbars;
                if (GuiManager.use_scrollbars) {
                    $("svg").parent().css("overflow", "scroll");

                }
                else {
                    $("svg").parent().css("overflow", "visible");
                }
            });
        };

        this.global_visiblity_btn_setup = function () {
            var GuiManager = this;
            this.dom.globalVisibilityButton.on("click", function (e) {
                var target = e.target;
                $(target).find("span").toggleClass("hidden");
                $(target).parent().toggleClass("active");
                GuiManager.global_visibility = !GuiManager.global_visibility;
                if (GuiManager.isGraphPresent())
                    if (GuiManager.graph_type == "stream")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                    else if (GuiManager.graph_type == "heat")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.graph_type_radio_setup = function () {
            var GuiManager = this;
            this.dom.graphType.on("change", function (e) {
                GuiManager.graph_type = $("input[name='graph_type']:checked").val();
                if (GuiManager.graph_type == "stream") {
                    $(".title").html("Global View");
                    $("div.main_svg").css("height", "70vh");
                    $("div.main_svg").css("width", "auto");
                    $(".canvas_container").css("width", "auto");
                    $("svg").parent().css("overflow", "visible");
                    $(".counter_asn").parent().find("label").text("#ASN");
                    $(".stream_option").removeClass("hidden");
                    $(".heat_option").addClass("hidden");
                }
                if (GuiManager.graph_type == "heat") {
                    $(".title").html("Local View");
                    $(".canvas_container").css("width", "100%");
                    if (GuiManager.use_scrollbars) {
                        $("svg").parent().css("overflow", "scroll");
                    }
                    else
                        $("body").css("overflow-y", "scroll");
                    $(".counter_asn").parent().find("label").text("#CP");
                    $(".stream_option").addClass("hidden");
                    $(".heat_option").removeClass("hidden");
                }
                GuiManager.ripeDataBroker.heuristicsManager.setDefaultHeuristic(GuiManager.graph_type);
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.ip_version_checkbox_setup = function () {
            var GuiManager = this;
            $("input[name='ip_version']").on("change", function (e) {
                GuiManager.ip_version = [];
                $("input[name='ip_version']:checked").each(function () {
                    GuiManager.ip_version.push(parseInt($(this).val()));
                });
                if (GuiManager.isGraphPresent()) {
                    if (GuiManager.graph_type == "heat")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                    else if (GuiManager.graph_type == "stream")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                }
            });
        };

        this.asn_level_setup = function () {
            var GuiManager = this;
            $("input[name='asn_lvl']:input").on("change", function (e, ui) {
                GuiManager.asn_level = $("input[name='asn_lvl']").spinner("value");
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.streaming_btn_setup = function () {
            var GuiManager = this;
            var interval;
            this.dom.streaming_Button.on("click", function (e, ui) {
                GuiManager.streaming = !GuiManager.streaming;
                streaming_icon_swap();
                if (GuiManager.streaming) {
                    GuiManager.lock_all();
                    interval = GuiManager.ripeDataBroker.streamgraph_streaming(GuiManager.streaming_speed);
                }
                else {
                    clearInterval(interval);
                    console.log("== GuiManager Streaming stopped");
                    GuiManager.draw_functions_btn_enabler();
                }
            });

            streaming_icon_swap = function () {
                var icon = this.dom.streaming_Button.find("span");
                if (this.streaming) {
                    icon.removeClass("glyphicon-record");
                    icon.addClass("glyphicon-stop");
                }
                else {
                    icon.addClass("glyphicon-record");
                    icon.removeClass("glyphicon-stop");
                }
            };
        };

        this.steps_btn_setup = function () {
            var GuiManager = this;
            $(".steps_btn").on("click", function (e, ui) {
                GuiManager.steps = !GuiManager.steps;
                if (GuiManager.steps) {
                    GuiManager.lock_all();
                    GuiManager.ripeDataBroker.streamgraph_stepped_view(50);
                }
            });
        };

        this.list_btn_setup = function () {
            var GuiManager = this;
            this.dom.listButton.on("click", function (e) {
                if (GuiManager.asn_info_done) {
                    $(".asn_list_btn").parent().removeClass("not-active");
                    $(".asn_list_btn").parent().removeClass("disabled");
                }
                else {
                    $(".asn_list_btn").parent().addClass("not-active");
                    $(".asn_list_btn").parent().addClass("disabled");
                }
                if (GuiManager.cp_info_done) {
                    $(".cp_list_btn").parent().removeClass("not-active");
                    $(".cp_list_btn").parent().removeClass("disabled");
                }
                else {
                    $(".cp_list_btn").parent().addClass("not-active");
                    $(".cp_list_btn").parent().addClass("disabled");
                }
            });
        };

        this.asn_list_btn_setup = function () {
            var GuiManager = this;
            $(".asn_list_btn").hover(function (event) {
                var html = "";
                var set;
                if (GuiManager.graph_type == "stream")
                    set = GuiManager.drawer.keys.slice(0).reverse();
                else if (GuiManager.graph_type == "heat")
                    set = GuiManager.drawer.asn_set.slice(0);
                for (var i in set) {
                    var asn = set[i];
                    var color_background = GuiManager.drawer.z(asn);
                    var color_text = GuiManager.drawer.colorManager.furthestLabelColor(color_background);
                    html += '<li class="list-group-item as' + asn + '" style="color:' + color_text + '; background-color:' + color_background + ';"'
                    if (GuiManager.graph_type == "stream")
                        html += 'onmouseover="d3.selectAll(\'.area\').filter(function(d){return d.key!=' + asn + ';}).style(\'fill-opacity\',\'0.35\');" onmouseout="d3.selectAll(\'.area\').style(\'fill-opacity\',1);">';
                    else if (GuiManager.graph_type == 'heat')
                        html += 'onmouseover="d3.selectAll(\'.area\').filter(function(d){return d.asn!=' + asn + ';}).style(\'fill-opacity\',\'0.35\');" onmouseout="d3.selectAll(\'.area\').style(\'fill-opacity\',1);">';
                    html += "<div> ASN: " + asn + "</div>";
                    var info = GuiManager.ripeDataBroker.current_parsed.known_asn[asn];
                    if (info) {
                        var tokens = info.split(",");
                        html += "<div>" + tokens[0].trim() + "</div>";
                        var country = tokens[tokens.length - 1].trim().split("-")[0];
                        html += '<div> Country: (' + country + ') <span class="flag-icon flag-icon-' + country.toLowerCase() + '" alt="' + country + '" title="' + country + '"></span></div>';
                    }
                    html += "</li>";
                }
                $(".asn_list").html(html);
                if (set.length < 11) {
                    $(".asn_list").css("height", "auto");
                    $(".asn_list").css("overflow-y", "visible");
                }
                else {
                    $(".asn_list").css("height", "");
                    $(".asn_list").css("overflow-y", "");
                }
            });
        };

        this.cp_list_btn_setup = function () {
            var GuiManager = this;
            $(".cp_list_btn").hover(function (event) {
                var html = "";
                var set;
                if (GuiManager.graph_type == "stream")
                    set = GuiManager.ripeDataBroker.current_parsed.cp_set;
                else if (GuiManager.graph_type == "heat")
                    set = GuiManager.drawer.keys;
                for (var i in set) {
                    var cp = set[i];
                    html += "<li>";
                    html += "<div> ID: " + cp + "</div>";
                    var info = GuiManager.ripeDataBroker.current_parsed.known_cp[cp];
                    if (info) {
                        html += "<div> IP: " + info["ip"] + "</div>";
                        html += "<div> Peering with CP: " + info["cp"] + "</div>";
                        html += "<div> From AS: " + info["as_number"] + "</div>";
                        var country = info["geo"].trim().split("-")[0];
                        html += '<div> Country: (' + country + ') <span class="flag-icon flag-icon-' + country.toLowerCase() + '" alt="' + country + '" title="' + country + '"></span></div>';
                    }
                    html += "</li>";
                }
                $(".cp_list").html(html);
                if (set.length < 11) {
                    $(".cp_list").css("height", "auto");
                    $(".cp_list").css("overflow-y", "visible");
                }
                else {
                    $(".cp_list").css("height", "");
                    $(".cp_list").css("overflow-y", "");
                }
            });
        };

        /************************** ORDERING BUTTONS **************************/
        //levensthein
        this.lev_dist_randwalk_cum_btn_setup = function () {
            var manager = this;
            $(".lev_dist_randwalk_cum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "lev_rnd_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.lev_dist_randwalk_max_btn_setup = function () {
            var manager = this;
            $(".lev_dist_randwalk_max_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "lev_rnd_max";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //best std dev random walking
        this.point_dist_by_randwalk_btn_setup = function () {
            var manager = this;
            $(".point_dist_by_randwalk_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_rnd_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.point_dist_by_inference_btn_setup = function () {
            var manager = this;
            $(".point_dist_by_inference_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_inf_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //STD DEV SWAP
        this.point_dist_greedy_btn_setup = function () {
            var manager = this;
            $(".point_dist_greedy_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_grdy_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //NEARFLOWS
        this.exchange_greedy_sort_btn_setup = function () {
            var manager = this;
            $(".exchange_greedy_sort_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "n_f";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //WIGGLES
        this.wiggle_sum_btn_setup = function () {
            var manager = this;
            $(".wiggle_sum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "w_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.wiggle_max_btn_setup = function () {
            var manager = this;
            $(".wiggle_max_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "w_max";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //SORTS
        this.sort_asn_ascstdev_btn_setup = function () {
            var manager = this;
            $(".sort_asn_ascstdev_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_st";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscstdev_btn_setup = function () {
            var manager = this;
            $(".sort_asn_dscstdev_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_st";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascvar_btn_setup = function () {
            var manager = this;
            $(".sort_asn_ascvar_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_var";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscvar_btn_setup = function () {
            var manager = this;
            $(".sort_asn_dscvar_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_var";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascavg_btn_setup = function () {
            var manager = this;
            $(".sort_asn_ascavg_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_avg";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscavg_btn_setup = function () {
            var manager = this;
            $(".sort_asn_dscavg_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_avg";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascsum_btn_setup = function () {
            var manager = this;
            $(".sort_asn_ascsum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscsum_btn_setup = function () {
            var manager = this;
            $(".sort_asn_dscsum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        /**HEATMAP**/
        this.heat_greedy_sort_1_btn_setup = function () {
            var manager = this;
            $(".heat_greedy_sort_1_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "nf_1";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_greedy_sort_2_btn_setup = function () {
            var manager = this;
            $(".heat_greedy_sort_2_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "nf_2";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_stdev_sort_btn_setup = function () {
            var manager = this;
            $(".heat_stdev_sort_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_grdy_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_geo_sort_btn_setup = function () {
            var manager = this;
            $(".heat_country_sort").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "geo";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_asn_sort_btn_setup = function () {
            var manager = this;
            $(".heat_as_sort").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "asn";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };


        /**************************************** OTHERS ************************************************/
        this.set_ordering = function (order) {
            this.ripeDataBroker.loadCurrentState(order, false, null, true);
        };

        this.get_ordering = function () {
            return this.drawer.keys;
        };

        this.restoreQuery = function () {
            // Populate UI elements
        };

        this.update_counters = function (selector, quantity) {
            $(selector).text(quantity);
        };

        /*************************************** BOTTOM BUTTONS ****************************************/
        this.docs_btn_setup = function () {
            var GuiManager = this;
            $(".docs_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/', '_blank');
                thewindow.blur();
            });
        };

        this.about_btn_setup = function () {
            var GuiManager = this;
            $(".about_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/', '_blank');
                thewindow.blur();
            });
        };

        this.embed_btn_setup = function () {
            var GuiManager = this;
            $(".embed_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/#embed', '_blank');
                thewindow.blur();
            });
        };
    };

    return GuiManager;
});