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

        this.getBGPdata = function () {
            
            console.log("Parsing Obtained Data...");
            try {
                this.current_parsed = this.parser.ripe_response_parse(data, this.current_starttime, this.current_endtime);
                if(this.GuiManager.gather_information){
                    console.log("=== RipeBroker Starting gathering CP Info");
                    this.GuiManager.cp_info_done=false;
                    setTimeout(function(){
                        this.getCPInfo(this.current_parsed.resources,0)
                    },0);
                }
                this.context.storeContext(this.current_starttime,"last_context_starttime");
                this.context.storeContext(this.current_endtime,"last_context_endtime");
                this.current_targets = data.data.targets.map(function (e) {return e['prefix'].replace(/"/g,'');}).join(",");
                this.context.storeContext(this.current_targets,"last_context_targets");
                this.loadCurrentState(true,this.GuiManager.drawer.events_range,true);

                if(this.GuiManager.gather_information){

                    setTimeout(function(){
                        this.GuiManager.asn_info_done=false;
                        if(this.GuiManager.graph_type=="stream")
                            this.getASNInfo(this.current_parsed.asn_set,0);
                        else
                        if(this.GuiManager.graph_type=="heat")
                            this.getASNInfo(this.GuiManager.drawer.asn_set,0);
                    },0);
                }
            }
            catch(err){
                console.log(err);
                alert("No data found for this target in the interval of time selected");
            }
            finally {
                this.GuiManager.draw_functions_btn_enabler();
                this.GuiManager.toggleLoader();
            }

            console.log("Waiting for RIPEStat...");
        }

    };

    return TranslationConnector;

});

