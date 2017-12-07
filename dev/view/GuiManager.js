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
        this.container = env.parentDom.find(".bgpst_container");

        this.tokenfield = env.parentDom.find(".tokenfield");

        this.drawer = new GraphDrawer(env);


        this.preserve_map = true;
        this.localstorage_enabled = true;
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

        this.url = location.protocol + '//' + location.host + location.pathname;

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

        this.isGraphPresent = function (text) {
            //return d3.select("svg").select(".chart").node() != null;
            return this.drawer.isGraphPresent();
        };

        //Loader splashscreen managing
        this.changeLoaderText = function (text) {
            //console.log("CAMBIA in "+text);
            $(this.loader).html(text);
        };

        //add tooltip  <-- TO CALL AT SETUP
        this.tooltip_setup = function () {
            env.parentDom.find('[data-toggle="tooltip"]').tooltip();
        };

        this.draggable_setup = function () {
            env.parentDom.find(".drag_sort_list").sortable();
        };

        this.pickers_setup = function () {

        };


        //other_command_menu
        this.other_command_button_setup = function () {
            this.shuffle_color_map_btn_setup();
            this.erase_graph_btn_setup();
            this.gather_information_btn_setup();
            this.preserve_color_map_btn_setup();
            this.local_storage_enabled_btn_setup();
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

        this.shuffle_color_map_btn_setup = function () {
            env.parentDom.find(".shuffle_color_map_btn").on("click", function (e) {
                if ($this.isGraphPresent()) {
                    $this.drawer.shuffle_color_map($this.graph_type);
                }
            });
        };


        this.draw_functions_btn_enabler = function () {
            if (!this.streaming) {
                env.parentDom.find(".option_command_btn").removeClass("disabled");
                env.parentDom.find(".clear_targets_button").removeClass("disabled");
                env.parentDom.find(".my_ip_button").removeClass("disabled");
                env.parentDom.find(".go_button").removeClass("disabled");
                env.parentDom.find(".input_add").find("input").removeClass("disabled");
                env.parentDom.find(".date").removeClass("disabled");

                env.parentDom.find(".option_command_btn").removeClass("not-active");
                env.parentDom.find(".clear_targets_button").removeClass("not-active");
                env.parentDom.find(".my_ip_button").removeClass("not-active");
                env.parentDom.find(".go_button").removeClass("not-active");
                env.parentDom.find(".input_add").find("input").removeClass("not-active");
                env.parentDom.find(".date").removeClass("not-active");

                env.parentDom.find(".tokenfield").tokenfield('enable');
                env.parentDom.find(".tokenfield").removeClass('disabled');
                env.parentDom.find(".tokenfield").removeClass('not-active');

                env.parentDom.find("input[name='ipversion']").attr("disabled", false);
                env.parentDom.find("input[name='ipversion']").parent().removeClass("disabled");
                env.parentDom.find("input[name='ipversion']").parent().removeClass("not-active");

                env.parentDom.find("input[name='graph_type']").parent().removeClass("disabled");
                env.parentDom.find("input[name='graph_type']").parent().removeClass("not-active");
                env.parentDom.find("input[name='graph_type']").parent().attr("disabled", false);

                if (this.isGraphPresent()) {
                    env.parentDom.find(".path_btn").removeClass("disabled");
                    env.parentDom.find(".list_btn").removeClass("disabled");
                    env.parentDom.find(".sort_btn").removeClass("disabled");
                    env.parentDom.find(".path_btn").removeClass("not-active");
                    env.parentDom.find(".list_btn").removeClass("not-active");
                    env.parentDom.find(".sort_btn").removeClass("not-active");
                    if (!this.ripeDataBroker.current_parsed.targets.some(function (e) {
                            return env.parentDom.findthis.validator.check_ipv4(e);
                        })) {
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("disabled");
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("not-active");
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", true);
                    }
                    else {
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("disabled");
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("not-active");
                        env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", false);
                    }
                    if (!this.ripeDataBroker.current_parsed.targets.some(function (e) {
                            return env.parentDom.findthis.validator.check_ipv6(e);
                        })) {
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("disabled");
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("not-active");
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", true);
                    }
                    else {
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("disabled");
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("not-active");
                        env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", false);
                    }
                    if (this.ip_version.indexOf(4) != -1) {
                        env.parentDom.find('input[name="ip_version"]').filter('[value="4"]').prop('checked', true);
                        env.parentDom.find('input[name="ip_version"]').filter('[value="4"]').parent().addClass("active");
                    }
                    else {
                        env.parentDom.find('input[name="ip_version"]').filter('[value="4"]').prop('checked', false);
                        env.parentDom.find('input[name="ip_version"]').filter('[value="4"]').parent().removeClass("active");
                    }
                    if (this.ip_version.indexOf(6) != -1) {
                        env.parentDom.find('input[name="ip_version"]').filter('[value="6"]').prop('checked', true);
                        env.parentDom.find('input[name="ip_version"]').filter('[value="6"]').parent().addClass("active");
                    }
                    else {
                        env.parentDom.find('input[name="ip_version"]').filter('[value="6"]').prop('checked', false);
                        env.parentDom.find('input[name="ip_version"]').filter('[value="6"]').parent().removeClass("active");
                    }
                    env.parentDom.find(".counter").removeClass("hidden");
                    this.draggable_setup();
                    if (this.graph_type == "stream") {
                        env.parentDom.find("input[name='steps'][value='steps']").parent().removeClass("disabled");
                        env.parentDom.find("input[name='steps'][value='steps']").parent().removeClass("not-active");
                        env.parentDom.find("input[name='steps'][value='steps']").parent().attr("disabled", false);
                        env.parentDom.find(".steps_btn").removeClass("not-active");

                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().removeClass("disabled");
                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().removeClass("not-active");
                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().attr("disabled", false);
                        env.parentDom.find(".streaming_btn").removeClass("not-active");
                    }
                    if (this.graph_type == "heat") {
                        env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("disabled");
                        env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("not-active");
                        env.parentDom.find("input[name='steps'][value='steps']").parent().attr("disabled", true);
                        env.parentDom.find(".steps_btn").addClass("not-active");

                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("disabled");
                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("not-active");
                        env.parentDom.find("input[name='streaming'][value='streaming']").parent().attr("disabled", true);
                        env.parentDom.find(".streaming_btn").addClass("not-active");
                    }
                    if (!this.steps) {
                        env.parentDom.find('input[name="steps"][value="steps"]').prop('checked', false);
                        env.parentDom.find('input[name="steps"][value="steps"]').parent().removeClass("active");
                    }
                }
                else {
                    env.parentDom.find(".path_btn").addClass("disabled");
                    env.parentDom.find(".list_btn").addClass("disabled");
                    env.parentDom.find(".sort_btn").addClass("disabled");
                    env.parentDom.find(".path_btn").addClass("not-active");
                    env.parentDom.find(".list_btn").addClass("not-active");
                    env.parentDom.find(".sort_btn").addClass("not-active");

                    env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", true);

                    env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", true);

                    env.parentDom.find(".counter").addClass("hidden");

                    env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("disabled");
                    env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("not-active");
                    env.parentDom.find("input[name='steps'][value='steps']").parent().attr("disabled", true);
                    env.parentDom.find(".steps_btn").addClass("not-active");

                    env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("disabled");
                    env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("not-active");
                    env.parentDom.find("input[name='streaming'][value='streaming']").parent().attr("disabled", true);
                    env.parentDom.find(".streaming_btn").addClass("not-active");
                }
            }
            env.parentDom.find("input.token-input").css("width", "auto");
        };

        this.lock_all = function () {
            env.parentDom.find(".path_btn").addClass("disabled");
            env.parentDom.find(".list_btn").addClass("disabled");
            env.parentDom.find(".sort_btn").addClass("disabled");
            env.parentDom.find(".option_command_btn").addClass("disabled");
            env.parentDom.find(".clear_targets_button").addClass("disabled");
            env.parentDom.find(".my_ip_button").addClass("disabled");
            env.parentDom.find(".go_button").addClass("disabled");
            env.parentDom.find(".input_add").find("input").addClass("disabled");
            env.parentDom.find(".date").addClass("disabled");

            env.parentDom.find(".path_btn").addClass("not-active");
            env.parentDom.find(".list_btn").addClass("not-active");
            env.parentDom.find(".sort_btn").addClass("not-active");
            env.parentDom.find(".option_command_btn").addClass("not-active");
            env.parentDom.find(".clear_targets_button").addClass("not-active");
            env.parentDom.find(".my_ip_button").addClass("not-active");
            env.parentDom.find(".go_button").addClass("not-active");
            env.parentDom.find(".input_add").find("input").addClass("not-active");
            env.parentDom.find(".date").addClass("not-active");

            env.parentDom.find(".tokenfield").tokenfield('disable');
            env.parentDom.find(".tokenfield").addClass('disabled');
            env.parentDom.find(".tokenfield").addClass('not-active');

            env.parentDom.find("input[name='graph_type']").parent().addClass("disabled");
            env.parentDom.find("input[name='graph_type']").parent().addClass("not-active");
            env.parentDom.find("input[name='graph_type']").parent().attr("disabled", true);

            env.parentDom.find("input[name='ipversion']").parent().addClass("disabled");
            env.parentDom.find("input[name='ipversion']").parent().addClass("not-active");
            env.parentDom.find("input[name='ipversion']").attr("disabled", true);

            env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("disabled");
            env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("not-active");
            env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", true);

            env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("disabled");
            env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("not-active");
            env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", true);

            env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("disabled");
            env.parentDom.find("input[name='steps'][value='steps']").parent().addClass("not-active");
            env.parentDom.find("input[name='steps'][value='steps']").parent().attr("disabled", true);
            env.parentDom.find(".steps_btn").addClass("not-active");

            if (!this.streaming) {
                env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("disabled");
                env.parentDom.find("input[name='streaming'][value='streaming']").parent().addClass("not-active");
                env.parentDom.find("input[name='streaming'][value='streaming']").parent().attr("disabled", true);
                env.parentDom.find(".streaming_btn").addClass("not-active");
            }
        };

        this.erase_graph_btn_setup = function () {
            env.parentDom.find(".erase_graph_btn").on("click", function (e) {
                $this.drawer.drawer_init();
                $this.draw_functions_btn_enabler();
            });
        };

        this.gather_information_btn_setup = function () {
            env.parentDom.find(".gather_information_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                $this.gather_information = !$this.gather_information;
            });
        };

        this.preserve_color_map_btn_setup = function () {
            env.parentDom.find(".preserve_color_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                $this.preserve_map = !$this.preserve_map;
            });
        };

        this.local_storage_enabled_btn_setup = function () {
            env.parentDom.find(".localstorage_enabled_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                $this.localstorage_enabled = !$this.localstorage_enabled;
            });
        };

        this.prepending_prevention_btn_setup = function () {
            env.parentDom.find(".prepending_prevention_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                $this.prepending_prevention = !$this.prepending_prevention;
                if ($this.isGraphPresent())
                    if ($this.graph_type == "stream")
                        $this.ripeDataBroker.loadCurrentState(false, null, true);
                    else if ($this.graph_type == "heat")
                        $this.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.merge_cp_btn_setup = function () {
            env.parentDom.find(".merge_cp_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                $this.merge_cp = !$this.merge_cp;
                if ($this.isGraphPresent()) {
                    $this.ripeDataBroker.loadCurrentState(false, null, true);
                    if ($this.merge_cp)
                        $this.update_counters(".counter_asn", $this.drawer.keys.length + "/" + $this.ripeDataBroker.current_parsed.cp_set.length);
                    else
                        $this.update_counters(".counter_asn", $this.drawer.keys.length);
                }
            });
        };

        this.merge_events_btn_setup = function () {
            env.parentDom.find("input[name='merge_events']:input").on("change", function (e, ui) {
                $this.merge_events = env.parentDom.find("input[name='merge_events']").spinner("value");
                if ($this.isGraphPresent()) {
                    $this.ripeDataBroker.loadCurrentState(false, null, true);
                    if ($this.merge_events)
                        $this.update_counters(".counter_events", $this.drawer.event_set.length + "/" + $this.ripeDataBroker.current_parsed.events.length);
                    else
                        $this.update_counters(".counter_events", $this.ripeDataBroker.current_parsed.events.length);
                }
            });
        };

        this.events_labels_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".events_labels_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                GuiManager.events_labels = !GuiManager.events_labels;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, false);
            });
        };

        this.cp_labels_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".cp_labels_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                GuiManager.cp_labels = !GuiManager.cp_labels;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, false);
            });
        };

        this.heatmap_time_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".heatmap_time_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                GuiManager.heatmap_time_map = !GuiManager.heatmap_time_map;
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.scrollbars_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".scrollbars_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                GuiManager.use_scrollbars = !GuiManager.use_scrollbars;
                if (GuiManager.use_scrollbars) {
                    env.parentDom.find("svg").parent().css("overflow", "scroll");

                }
                else {
                    env.parentDom.find("svg").parent().css("overflow", "visible");
                }
            });
        };

        this.global_visiblity_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".global_visibility_btn").on("click", function (e) {
                var target = e.target;
                env.parentDom.find(target).find("span").toggleClass("hidden");
                env.parentDom.find(target).parent().toggleClass("active");
                GuiManager.global_visibility = !GuiManager.global_visibility;
                if (GuiManager.isGraphPresent())
                    if (GuiManager.graph_type == "stream")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
                    else if (GuiManager.graph_type == "heat")
                        GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.boolean_checker = function () {
            if (!this.gather_information) {
                env.parentDom.find(".gather_information_btn").find("span").addClass("hidden");
                env.parentDom.find(".gather_information_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".gather_information_btn").find("span").removeClass("hidden");
                env.parentDom.find(".gather_information_btn").parent().addClass("active");
            }

            if (!this.preserve_map) {
                env.parentDom.find(".preserve_color_btn").find("span").addClass("hidden");
                env.parentDom.find(".preserve_color_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".preserve_color_btn").find("span").removeClass("hidden");
                env.parentDom.find(".preserve_color_btn").parent().addClass("active");
            }

            if (!this.localstorage_enabled) {
                env.parentDom.find(".localstorage_enabled_btn").find("span").addClass("hidden");
                env.parentDom.find(".localstorage_enabled_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".localstorage_enabled_btn").find("span").removeClass("hidden");
                env.parentDom.find(".localstorage_enabled_btn").parent().addClass("active");
            }

            if (!this.global_visibility) {
                env.parentDom.find(".global_visibility_btn").find("span").addClass("hidden");
                env.parentDom.find(".global_visibility_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".global_visibility_btn").find("span").removeClass("hidden");
                env.parentDom.find(".global_visibility_btn").parent().addClass("active");
            }

            if (!this.prepending_prevention) {
                env.parentDom.find(".prepending_prevention_btn").find("span").addClass("hidden");
                env.parentDom.find(".prepending_prevention_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".prepending_prevention_btn").find("span").removeClass("hidden");
                env.parentDom.find(".prepending_prevention_btn").parent().addClass("active");
            }

            if (!this.merge_cp) {
                env.parentDom.find(".merge_cp_btn").find("span").addClass("hidden");
                env.parentDom.find(".merge_cp_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".merge_cp_btn").find("span").removeClass("hidden");
                env.parentDom.find(".merge_cp_btn").parent().addClass("active");
            }

            if (!this.events_labels) {
                env.parentDom.find(".events_labels_btn").find("span").addClass("hidden");
                env.parentDom.find(".events_labels_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".events_labels_btn").find("span").removeClass("hidden");
                env.parentDom.find(".events_labels_btn").parent().addClass("active");
            }

            if (!this.cp_labels) {
                env.parentDom.find(".cp_labels_btn").find("span").addClass("hidden");
                env.parentDom.find(".cp_labels_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".cp_labels_btn").find("span").removeClass("hidden");
                env.parentDom.find(".cp_labels_btn").parent().addClass("active");
            }

            if (!this.heatmap_time_map) {
                env.parentDom.find(".heatmap_time_btn").find("span").addClass("hidden");
                env.parentDom.find(".heatmap_time_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".heatmap_time_btn").find("span").removeClass("hidden");
                env.parentDom.find(".heatmap_time_btn").parent().addClass("active");
            }

            if (!this.use_scrollbars) {
                env.parentDom.find(".scrollbars_btn").find("span").addClass("hidden");
                env.parentDom.find(".scrollbars_btn").parent().removeClass("active");
            }
            else {
                env.parentDom.find(".scrollbars_btn").find("span").removeClass("hidden");
                env.parentDom.find(".scrollbars_btn").parent().addClass("active");
            }

            if (this.graph_type == "stream") {
                env.parentDom.find('input[name="graph_type"][value="stream"]').prop('checked', true);
                env.parentDom.find('input[name="graph_type"][value="stream"]').parent().addClass("active");
                env.parentDom.find('input[name="graph_type"][value="heat"]').parent().removeClass("active");
                env.parentDom.find(".stream_option").removeClass("hidden");
                env.parentDom.find(".heat_option").addClass("hidden");
            }
            else if (this.graph_type == "heat") {
                env.parentDom.find('input[name="graph_type"][value="heat"]').prop('checked', true);
                env.parentDom.find('input[name="graph_type"][value="heat"]').parent().addClass("active");
                env.parentDom.find('input[name="graph_type"][value="stream"]').parent().removeClass("active");
                env.parentDom.find(".heat_option").removeClass("hidden");
                env.parentDom.find(".stream_option").addClass("hidden");
            }
            if (this.ip_version.indexOf(4) != -1) {
                env.parentDom.find('input[name="ip_version"][value="4"]').prop('checked', true);
                env.parentDom.find('input[name="ip_version"][value="4"]').parent().addClass("active");
            }
            if (this.ip_version.indexOf(6) != -1) {
                env.parentDom.find('input[name="ip_version"][value="6"]').prop('checked', true);
                env.parentDom.find('input[name="ip_version"][value="6"]').parent().addClass("active");
            }

            env.parentDom.find(".asn_lvl").spinner();
            env.parentDom.find(".asn_lvl").spinner("value", this.asn_level);
            env.parentDom.find(".merge_events").spinner();
            env.parentDom.find(".merge_events").spinner("value", this.merge_events);
        };

        this.graph_type_radio_setup = function () {
            var GuiManager = this;
            env.parentDom.find("input[name='graph_type']").on("change", function (e) {
                GuiManager.graph_type = env.parentDom.find("input[name='graph_type']:checked").val();
                if (GuiManager.graph_type == "stream") {
                    env.parentDom.find(".title").html("Global View");
                    env.parentDom.find("div.main_svg").css("height", "70vh");
                    env.parentDom.find("div.main_svg").css("width", "auto");
                    env.parentDom.find(".canvas_container").css("width", "auto");
                    env.parentDom.find("svg").parent().css("overflow", "visible");
                    env.parentDom.find(".counter_asn").parent().find("label").text("#ASN");
                    env.parentDom.find(".stream_option").removeClass("hidden");
                    env.parentDom.find(".heat_option").addClass("hidden");
                }
                if (GuiManager.graph_type == "heat") {
                    env.parentDom.find(".title").html("Local View");
                    env.parentDom.find(".canvas_container").css("width", "100%");
                    if (GuiManager.use_scrollbars) {
                        env.parentDom.find("svg").parent().css("overflow", "scroll");
                    }
                    else
                        env.parentDom.find("body").css("overflow-y", "scroll");
                    env.parentDom.find(".counter_asn").parent().find("label").text("#CP");
                    env.parentDom.find(".stream_option").addClass("hidden");
                    env.parentDom.find(".heat_option").removeClass("hidden");
                }
                GuiManager.ripeDataBroker.heuristicsManager.setDefaultHeuristic(GuiManager.graph_type);
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.ip_version_checkbox_setup = function () {
            var GuiManager = this;
            env.parentDom.find("input[name='ip_version']").on("change", function (e) {
                GuiManager.ip_version = [];
                env.parentDom.find("input[name='ip_version']:checked").each(function () {
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

        this.ip_version_checkbox_enabler = function () {
            GuiManager = this;
            if (!this.streaming) {
                if (this.ripeDataBroker.current_parsed.targets.every(function (e) {
                        return GuiManager.validator.check_ipv4(e);
                    })) {
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", false);
                    this.ip_version = [4];
                }
                else {
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().addClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", true);
                }
                if (this.ripeDataBroker.current_parsed.targets.every(function (e) {
                        return GuiManager.validator.check_ipv6(e);
                    })) {
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", false);
                    this.ip_version = [6];
                }
                else {
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().addClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", true);
                }
                if (this.ripeDataBroker.current_parsed.targets.some(function (e) {
                        return GuiManager.validator.check_ipv4(e);
                    }) && this.ripeDataBroker.current_parsed.targets.some(function (e) {
                        return GuiManager.validator.check_ipv6(e);
                    })) {
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().removeClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='4']").parent().attr("disabled", false);
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("disabled");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().removeClass("not-active");
                    env.parentDom.find("input[name='ip_version'][value='6']").parent().attr("disabled", false);
                    if (this.ip_version.length == 0)
                        this.ip_version = [4];
                }
            }
        };

        this.asn_level_setup = function () {
            var GuiManager = this;
            env.parentDom.find("input[name='asn_lvl']:input").on("change", function (e, ui) {
                GuiManager.asn_level = env.parentDom.find("input[name='asn_lvl']").spinner("value");
                if (GuiManager.isGraphPresent())
                    GuiManager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.streaming_btn_setup = function () {
            var GuiManager = this;
            var interval;
            env.parentDom.find(".streaming_btn").on("click", function (e, ui) {
                GuiManager.streaming = !GuiManager.streaming;
                GuiManager.streaming_icon_swap();
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
        };

        this.streaming_icon_swap = function () {
            var icon = env.parentDom.find(".streaming_btn").find("span");
            if (this.streaming) {
                icon.removeClass("glyphicon-record");
                icon.addClass("glyphicon-stop");
            }
            else {
                icon.addClass("glyphicon-record");
                icon.removeClass("glyphicon-stop");
            }
        };

        this.steps_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".steps_btn").on("click", function (e, ui) {
                GuiManager.steps = !GuiManager.steps;
                if (GuiManager.steps) {
                    GuiManager.lock_all();
                    GuiManager.ripeDataBroker.streamgraph_stepped_view(50);
                }
            });
        };

        this.list_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".list_btn").on("click", function (e) {
                if (GuiManager.asn_info_done) {
                    env.parentDom.find(".asn_list_btn").parent().removeClass("not-active");
                    env.parentDom.find(".asn_list_btn").parent().removeClass("disabled");
                }
                else {
                    env.parentDom.find(".asn_list_btn").parent().addClass("not-active");
                    env.parentDom.find(".asn_list_btn").parent().addClass("disabled");
                }
                if (GuiManager.cp_info_done) {
                    env.parentDom.find(".cp_list_btn").parent().removeClass("not-active");
                    env.parentDom.find(".cp_list_btn").parent().removeClass("disabled");
                }
                else {
                    env.parentDom.find(".cp_list_btn").parent().addClass("not-active");
                    env.parentDom.find(".cp_list_btn").parent().addClass("disabled");
                }
            });
        };

        this.asn_list_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".asn_list_btn").hover(function (event) {
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
                env.parentDom.find(".asn_list").html(html);
                if (set.length < 11) {
                    env.parentDom.find(".asn_list").css("height", "auto");
                    env.parentDom.find(".asn_list").css("overflow-y", "visible");
                }
                else {
                    env.parentDom.find(".asn_list").css("height", "");
                    env.parentDom.find(".asn_list").css("overflow-y", "");
                }
            });
        };

        this.cp_list_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".cp_list_btn").hover(function (event) {
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
                env.parentDom.find(".cp_list").html(html);
                if (set.length < 11) {
                    env.parentDom.find(".cp_list").css("height", "auto");
                    env.parentDom.find(".cp_list").css("overflow-y", "visible");
                }
                else {
                    env.parentDom.find(".cp_list").css("height", "");
                    env.parentDom.find(".cp_list").css("overflow-y", "");
                }
            });
        };

        /************************** ORDERING **************************/
        //levensthein
        this.lev_dist_randwalk_cum_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".lev_dist_randwalk_cum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "lev_rnd_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.lev_dist_randwalk_max_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".lev_dist_randwalk_max_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "lev_rnd_max";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //best std dev random walking
        this.point_dist_by_randwalk_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".point_dist_by_randwalk_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_rnd_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.point_dist_by_inference_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".point_dist_by_inference_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_inf_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //STD DEV SWAP
        this.point_dist_greedy_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".point_dist_greedy_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_grdy_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //NEARFLOWS
        this.exchange_greedy_sort_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".exchange_greedy_sort_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "n_f";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //WIGGLES
        this.wiggle_sum_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".wiggle_sum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "w_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.wiggle_max_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".wiggle_max_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "w_max";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        //SORTS
        this.sort_asn_ascstdev_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_ascstdev_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_st";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscstdev_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_dscstdev_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_st";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascvar_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_ascvar_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_var";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscvar_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_dscvar_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_var";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascavg_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_ascavg_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_avg";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscavg_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_dscavg_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_avg";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_ascsum_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_ascsum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "asc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.sort_asn_dscsum_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".sort_asn_dscsum_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "s_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = "dsc";
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        /**HEATMAP**/
        this.heat_greedy_sort_1_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".heat_greedy_sort_1_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "nf_1";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_greedy_sort_2_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".heat_greedy_sort_2_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "nf_2";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_stdev_sort_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".heat_stdev_sort_btn").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "st_grdy_cum";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_geo_sort_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".heat_country_sort").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "geo";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

        this.heat_asn_sort_btn_setup = function () {
            var manager = this;
            env.parentDom.find(".heat_as_sort").on("click", function (e) {
                manager.ripeDataBroker.heuristicsManager.current_heuristic = "asn";
                manager.ripeDataBroker.heuristicsManager.current_sort_type = null;
                manager.ripeDataBroker.loadCurrentState(false, null, true);
            });
        };

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
            env.parentDom.find(selector).text(quantity);
        };

        /*******************************************************************************/
        this.docs_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".docs_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/', '_blank');
                thewindow.blur();
            });
        };

        this.about_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".about_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/', '_blank');
                thewindow.blur();
            });
        };

        this.embed_btn_setup = function () {
            var GuiManager = this;
            env.parentDom.find(".embed_btn").on("click", function (e) {
                var thewindow = window.open('https://massimo.ripe.net/bgpstreamgraph/#embed', '_blank');
                thewindow.blur();
            });
        };
    };

    return GuiManager;
});