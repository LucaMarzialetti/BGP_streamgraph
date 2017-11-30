define([
    /*validator*/
    /*functions*/
    "bgpst.controller.validator",
    "bgpst.controller.functions"
], function(validator, functions){

    var RipeDataParser = function() {
        console.log("==== RipeParser Starting");
        this.validator = new Validator();
        this.rrc_map;
        this.states = [];
        this.events = [];
        this.resources = [];
        this.asn_distributions = [];
        this.last_date;

        this.asn_set = [];
        this.rrc_set = [];
        this.asn_freqs = [];
        this.asn_sumfreqs = [];
        this.asn_avgfreqs = [];
        this.asn_varfreqs = [];
        this.asn_stdev = [];
        this.rrc_shiftings = {};

        this.fake_head = false;
        this.fake_tail = false;
        this.query_starttime = "";
        this.query_endtime = "";

        this.known_asn = {};
        this.known_rrc = {};

        console.log("==== RipeParser Ready");
    };

    /**manage the events and state of the announcement**/
    //the level of detail is by RRC and only later cumulated to ASN view
    //there are fiew global variables used to maintain the state of the flow
    //states_asn:array of states, each state is a normalized vector of ASN weight on routing
    //states:array of states, each state is rrc routing
    //events:array of timestamps, one for each state
    //rrc_map:object used to maintain the current state
    //last_date:last timestamp seen

    //ripe_response_parse();
    //main function to call for parsing
    RipeDataParser.prototype.ripe_response_parse = function(json,start,end) {
        //on local load from data.json
        //json = require('./data.json');
        //global variables init
        var data = json['data'];
        this.rrc_map = {};
        this.states = {};
        this.events = [];
        this.resources = [];
        this.targets = [];
        this.last_date = data['query_starttime'];
        this.asn_distributions = [];
        this.asn_set = [];
        this.rrc_set = [];
        this.asn_freqs = {};
        this.asn_sumfreqs = {};
        this.asn_avgfreqs = {};
        this.asn_varfreqs = {};
        this.asn_stdev = {};

        //fetch nodes and cp
        this.fetchNodes(data);
        this.fetchCP(data);

        //date
        this.query_starttime = data['query_starttime'];
        this.query_endtime = data['query_endtime'];

        //estraggo i targets
        for(var t in data['targets']){
            this.targets.push(data['targets'][t]['prefix']);
        }
        this.resources = data.sources;
        //inizializza la mappa in base al numero di targets
        for(var t in this.targets){
            this.rrc_map[this.targets[t]] = {};
            this.states[this.targets[t]] = [];
        }
        //stato iniziale
        if(data.initial_state.length>0)
            this.loadFirstState(json);
        //eventi
        if(data.events.length>0)
            this.loadUpdates(json);
        //zero fill
        this.zeroFilling(start,end);
        //for debugging
        var log_on = false;
        var print_on = false;
        if(log_on) {
            console.log(this.states);
            console.log(this.events);
            console.log(this.resources);
            console.log(this.targets);
            console.log(this.rrc_set);
        }
        if(print_on){
            this.print_json_to_file(this.states,'states.json');
            this.print_json_to_file(this.events,'events.json');
            this.print_json_to_file(this.targets,'targets.json');
            this.print_json_to_file(this.resources,'resources.json');
            this.print_json_to_file(this.rrc_set,'map.json');
        }
        return {
            query_id:json['query_id'],
            states:this.states,			//array of values % by rrc
            events:this.events,			//array of timestamps
            targets:this.targets,		//array of targets
            resources:this.resources,	//array of RRC by asn
            rrc_set: this.rrc_set,		//array of cp
            asn_set: this.asn_set,

            asn_freqs:this.asn_freqs,
            asn_sumfreqs:this.asn_sumfreqs,
            asn_avgfreqs:this.asn_avgfreqs,
            asn_varfreqs:this.asn_varfreqs,
            asn_stdev:this.asn_stdev,
            asn_distributions:this.asn_distributions,

            query_starttime:this.query_starttime,
            query_endtime:this.query_endtime,
            fake_head:this.fake_head,
            fake_tail:this.fake_tail,

            known_asn: this.known_asn,
            known_rrc: this.known_rrc
        }
    };

    //first load function, load the initial state and the first events
    RipeDataParser.prototype.loadFirstState = function(json) {
        var data = json['data'];
        this.makeIntialStateMapping(data);
        this.snapshotOfState();
        //data_check();
    };

    //only load new events on the already existing configuration
    RipeDataParser.prototype.loadUpdates = function(json) {
        var data = json['data'];
        this.fetchUpdates(data);
        this.snapshotOfState();
        //data_check();
    };

    //initialize the rrc_map
    RipeDataParser.prototype.makeIntialStateMapping = function(data) {
        var initial_state = data['initial_state'];
        for(var i in initial_state){
            var state = initial_state[i];
            var path = state['path'];
            var rrc_id = state['source_id'];
            if(this.rrc_set.indexOf(rrc_id) == -1)
                this.rrc_set.push(rrc_id);
            this.rrc_map[state['target_prefix']][rrc_id] = path;
        }
    };

    //fetch updates event using timestamp to cumultate the effects
    //everytime the last_date is different from the current event timestamp a new "state" as a snapshot is taken
    //from the rrc_map
    RipeDataParser.prototype.fetchUpdates = function(data) {
        var updates = data['events'];
        this.last_date = updates[0]['timestamp'];
        for(var i in updates) {
            var e = updates[i];
            var e_attrs = e['attrs'];
            var e_s_id = e_attrs['source_id'];
            var e_target = e_attrs['target_prefix'];
            var e_type = e['type'];
            //if its a new resource add to rrc_set
            if(this.rrc_set.indexOf(e_s_id) == -1)
                this.rrc_set.push(e_s_id);
            //make snapshot if timestamp is different
            if(this.last_date != e['timestamp']){
                this.snapshotOfState();
                this.last_date = e['timestamp'];
            }
            switch(e_type){
                case 'A':
                    this.rrc_map[e_target][e_s_id] = e_attrs['path'];
                    break;
                case 'W':
                    this.rrc_map[e_target][e_s_id] = "";
                    break;
                default:
                    break;
            }
        }
    };

    //take a snapshot of the rrc_map
    //cumulate the single RRC announcement into ASN view
    RipeDataParser.prototype.snapshotOfState = function() {
        for(var t in this.targets)
            this.states[this.targets[t]].push(JSON.parse(JSON.stringify(this.rrc_map[this.targets[t]])));
        this.events.push(this.last_date);
    };

    //zero fill the rrcs in every moment
    RipeDataParser.prototype.zeroFilling = function(start,end) {
        for(var t in this.targets){
            var tgt = this.targets[t];
            for(var i in this.states[tgt]){
                var e = this.states[tgt][i];
                for(var r in this.rrc_set){
                    var rrc = this.rrc_set[r];
                    if(!e[rrc])
                        e[rrc] = [];
                }
            }
        }

        //PATCH EVENT BEFORE AND AFTER
        if(moment(this.events[0]).isAfter(moment(start))){
            console.log("ADDED HEAD FAKE EVENT");
            this.fake_head = true;
            this.query_starttime = start;
        }
        else
            this.fake_head = false;
        if(moment(this.events[this.events.length-1]).isBefore(moment(end))){
            console.log("ADDED TAIL FAKE EVENT");
            this.fake_tail = true;
            this.query_endtime = end;
        }
        else
            this.fake_tail = false;
        //}
    };

    //object of rrc and an array of states for any of them
    // MAP OF RRC AND THEIR ASN TRAVERSED
    RipeDataParser.prototype.states_rrc = function(parsed,level,antiprepending){
        this.states_by_rrc = {};
        //init
        for(var r in parsed.rrc_set)
            this.states_by_rrc[parsed.rrc_set[r]] = [];
        //popolate
        for(var t in parsed.targets){
            var tgt = parsed.targets[t];
            var states = parsed.states[tgt];
            for(var s in states){
                var state = states[s];
                for(var r in state){
                    var rrc = state[r];
                    if(antiprepending)
                        rrc = no_consecutive_repetition(rrc);
                    if(rrc.length>level)
                        this.states_by_rrc[r].push(rrc[rrc.length-level-1]);
                    else
                        this.states_by_rrc[r].push(null);
                }
            }
        }
        parsed.states_by_rrc = this.states_by_rrc;
    };

    //object of rrc and their asn sorted for occurrences
    //MAP OF RRC AND ASN COMPOSITION (ORDERED SET OF ASN FOR THAT RRC)
    RipeDataParser.prototype.rrc_composition = function(parsed){
        this.rrc_by_composition = {};
        for(var r in parsed.rrc_set) {
            var rrc = parsed.rrc_set[r];
            var asn_seq = parsed.states_by_rrc[rrc];
            this.rrc_by_composition[rrc] = sort_by_occurrences(asn_seq);
        }
        parsed.rrc_by_composition = this.rrc_by_composition;
    }; 

    //object of rrc and their asn seqs changed
    //MAP OF RRC AND ASN TRAVERSED (SEQUENCE OF ASN TRAVERSED)
    RipeDataParser.prototype.rrc_seqs = function(parsed){
        this.rrc_by_seqs = {};
        for(var r in parsed.rrc_set) {
            var rrc = parsed.rrc_set[r];
            var asn_seq = parsed.states_by_rrc[rrc];
            this.rrc_by_seqs[rrc] = no_consecutive_repetition(asn_seq);
        }
        parsed.rrc_by_seqs = this.rrc_by_seqs;
    };

    //MAP OF ASN (AND EXCHANGES FOR OTHER ASN COUNTED)
    RipeDataParser.prototype.asn_exchanges = function(parsed){
        this.asn_by_exchanges = {}
        for(var i in parsed.rrc_set){
            var as_list = parsed.rrc_by_seqs[parsed.rrc_set[i]];
            if(as_list.length>1){
                for(var a = 0; a<as_list.length-1; a++){
                    var pre = as_list[a];
                    var post = as_list[a+1];
                    if(!this.asn_by_exchanges[pre])
                        this.asn_by_exchanges[pre] = {};
                    var counter = this.asn_by_exchanges[pre][post];
                    if(!counter)
                        counter = 0;
                    counter++;
                    this.asn_by_exchanges[pre][post] = counter;
                }
            }
        }
        parsed.asn_by_exchanges = this.asn_by_exchanges;
    };

    RipeDataParser.prototype.get_rrc_shiftings = function(parsed){
        this.rrc_shiftings = {};
        for(var t in parsed.targets){
            this.rrc_shiftings[parsed.targets[t]] = {};
        }
        for(var r in parsed.rrc_set) {
            this.rrc_shiftings[parsed.rrc_set[r]] = [];
        }
        for(var r in parsed.rrc_set) {
            var rrc = parsed.rrc_set[r];
            for(var s in parsed.states){
                var  val = parsed.states[s][rrc];
                this.rrc_shiftings[rrc].push(val);
            }
        }
        parsed.rrc_shiftings = this.rrc_shiftings;
    };

    /* compute the frequency analysis */
    RipeDataParser.prototype.computeAsnFrequencies = function(data){
        //initialization
        this.asn_freqs = {};
        this.asn_sumfreqs = {};
        this.asn_avgfreqs = {};
        this.asn_varfreqs = {};
        this.asn_stdev = {};
        for(var a in this.asn_set)
            this.asn_freqs[this.asn_set[a]] = [];
        for(var i in data){
            for(var a in this.asn_set){
                this.asn_freqs[this.asn_set[a]].push(data[i][this.asn_set[a]]);
            }
        }
        //compute cumulate, avg, variance and std_dev
        for(var a in this.asn_freqs){
            this.asn_sumfreqs[a] = cumulate(this.asn_freqs[a]);
            this.asn_avgfreqs[a] = average(this.asn_freqs[a],this.asn_sumfreqs[a]);
            this.asn_varfreqs[a] = variance(this.asn_freqs[a],this.asn_avgfreqs[a]);
            this.asn_stdev[a] = std_dev(this.asn_freqs[a],this.asn_varfreqs[a]);
        }
    };

    RipeDataParser.prototype.fetchNodes = function(data) {
        for(var a in data.nodes){
            var node = data.nodes[a];
            var asn = node["as_number"];
            var owner = node["owner"];
            if(!this.known_asn[asn])
                this.known_asn[asn] = owner;
        }
    };

    RipeDataParser.prototype.fetchCP = function(data) {
        for(var a in data.sources){
            var node = data.sources[a];
            var id = node["id"];
            var ip = node["ip"];
            var rrc = node["rrc"];
            var as_number = node["as_number"];
            var geo_of_as = this.known_asn[as_number];
            if(geo_of_as){
                var index = geo_of_as.lastIndexOf(",");
                var geo = geo_of_as.substr(index+1).split("-")[0].trim();
            }
            if(geo){
                this.known_rrc[id] = {
                    "ip":ip,
                    "id":id,
                    "rrc":rrc,
                    "as_number":as_number,
                    "geo":geo
                }
            }
        }
    };

    //print out the object to a file
    RipeDataParser.prototype.print_json_to_file = function(json, filename) {
        var fs = require('fs');
        fs.writeFile("./"+filename, JSON.stringify(json,null,4), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(filename+" file written");
        });
    };

    /************************************************ CONVERSIONS ************************************************/

    RipeDataParser.prototype.comune_converter = function(data, antiprepending, level, target_types) {
        this.asn_distributions = [];
        var include_ipv4 = target_types.indexOf(4)!= -1;
        var include_ipv6 = target_types.indexOf(6)!= -1;

        this.asn_set = [];
        this.local_visibility = 0;
        //initialize
        for(var i in data.events)
            this.asn_distributions.push({});
        //counting
        for(var t in data.targets) {
            var tgt = data.targets[t];
            if((include_ipv4 && this.validator.check_ipv4(tgt)) || (include_ipv6 && this.validator.check_ipv6(tgt))) {
                for(var i in data.states[tgt]) {
                    var state = data.states[tgt][i];
                    var tot = 0;
                    for(var e in state) {
                        var path = state[e];
                        if(antiprepending) {
                            //antiprepending-da-spostare
                            path = no_consecutive_repetition(path);
                        }
                        if(path != = "" && path.length>(level)) {
                            var asn = path[path.length-(level+1)];
                            //update the asn list if wasnt discovered
                            if(this.asn_set.indexOf(asn) == -1)
                                this.asn_set.push(asn);
                            //update counters
                            var temp = this.asn_distributions[i][asn];
                            if(!temp)
                                temp = 0;
                            this.asn_distributions[i][asn] = (temp+1);
                            tot++;
                        }
                    }
                    this.asn_distributions[i]['tot_number'] = tot;
                    if(tot>this.local_visibility)
                        this.local_visibility = tot;
                }
            }
        }
        //zero-filling
        for(var i in this.asn_distributions)
            for(var a in this.asn_set){
                if(!this.asn_distributions[i][this.asn_set[a]])
                    this.asn_distributions[i][this.asn_set[a]] = 0;
            }
        data.asn_distributions = this.asn_distributions;
        this.computeAsnFrequencies(this.asn_distributions);
        this.computeDifferenceVector(data);
        this.computeDistanceVector(data);
        this.get_rrc_shiftings(data);
        data.asn_freqs = this.asn_freqs;
        data.asn_sumfreqs = this.asn_sumfreqs;
        data.asn_avgfreqs = this.asn_avgfreqs;
        data.asn_varfreqs = this.asn_varfreqs;
        data.asn_stdev = this.asn_stdev;
        data.query_starttime = this.query_starttime;
        data.query_endtime = this.query_endtime;
        data.local_visibility = this.local_visibility;
    };

    //convert the data to a TSV format for streamgraph
    RipeDataParser.prototype.convert_to_streamgraph_tsv = function(data, antiprepending, level, target_types) {
        this.comune_converter(data,antiprepending,level,target_types);

        var real_states = data.asn_distributions.concat();
        var real_events = data.events.concat();
        var dummy_state = {};

        if(data.fake_tail || data.fake_tail){
            for(var d in this.asn_set){
                dummy_state[this.asn_set[d]] = 0;
            }
            dummy_state['tot_number'] = 0;
        }

        if(data.fake_head){
            real_states = [dummy_state].concat(real_states);
            real_events = [data.query_starttime].concat(real_events);
            console.log(real_states)
        }

        if(data.fake_tail){
            real_states = real_states.concat(real_states[real_states.length-1]);
            real_events = real_events.concat(data.query_endtime);
        }

        //parse to TSV
        var converted_data = [];
        //TSV header
        var header = "date\ttot_number";
        for(var i in this.asn_set)
            header+="\t"+this.asn_set[i];
        converted_data.push(header);
        //TSV DATA
        var last_values ="";
        var length = real_events.length-1;
        for(var i = 0; i<length; i++){
            var date = real_events[i]+"\t";
            var tot = real_states[i]['tot_number'];
            var values = "";
            for(var j in this.asn_set){
                var value = real_states[i][this.asn_set[j]];
                if(!value)
                    value = 0;
                values+="\t"+value;
            }
            values = tot+values;
            line = date+values;

            //PATCH FOR STREAMGRAPH AVOID INTERPOLATION
            if(last_values != "" && last_values != values && i<data.events.length-2){
                converted_data.push(date+last_values);
            }
            converted_data.push(line);
            last_values = values;
        }

        var last_date = real_events[length]+"\t";
        var last_tot = real_states[length]['tot_number'];
        var last_values ="";
        for(var j in this.asn_set){
            var value = real_states[length][this.asn_set[j]];
            if(!value)
                value = 0;
            last_values+="\t"+value;
        }
        last_values = last_tot+last_values;
        converted_data.push(date+last_values);
        converted_data.push(last_date+last_values);

        var converted = converted_data.join("\n");
        data.asn_set = this.asn_set;
        return converted;
    };

    //convert the data to a TSV format for heatmap
    RipeDataParser.prototype.convert_to_heatmap_tsv = function(data,antiprepending, level, target_types) {
        this.comune_converter(data,antiprepending,level,target_types);

        var real_states = {};
        var real_events = data.events.concat();
        var dummy_state = {};

        if(data.fake_tail || data.fake_tail){
            for(var d in this.rrc_set)
                dummy_state[this.rrc_set[d]] = [];
        }

        for(var t in data.targets) {
            var tgt = data.targets[t];
            real_states[tgt] = data.states[tgt].concat();
        }

        if(data.fake_head){
            for(var t in data.targets) {
                var tgt = data.targets[t];
                real_states[tgt] = [dummy_state].concat(real_states[tgt]);
            }
            real_events = [data.query_starttime].concat(real_events);
        }

        if(data.fake_tail){
            for(var t in data.targets) {
                var tgt = data.targets[t];
                //real_states[tgt]=real_states[tgt].concat(real_states[tgt][real_states[tgt].length-1]);
                real_states[tgt] = real_states[tgt].concat(dummy_state);
            }
            real_events = real_events.concat(data.query_endtime);
        }

        console.log(real_events)
        var converted_data = [];
        var header = "date\trrc\tasn_path";
        var rrc_set = data.rrc_set.sort();
        var include_ipv4 = target_types.indexOf(4)!= -1;
        var include_ipv6 = target_types.indexOf(6)!= -1;
        converted_data.push(header);
        for(var t in data.targets){
            var tgt = data.targets[t];
            if((include_ipv4 && this.validator.check_ipv4(tgt)) || (include_ipv6 && this.validator.check_ipv6(tgt))) {
                for(var i in real_states[tgt]){
                    var state = real_states[tgt][i];
                    for(var j in rrc_set){
                        var path = state[rrc_set[j]];
                        if(!Array.isArray(path))
                            path = [];
                        var line = real_events[i];
                        line+="\t"+rrc_set[j]+"\t"+JSON.stringify(path);
                        converted_data.push(line);
                    }
                }
            }
        }
        var converted = converted_data.join("\n");
        return converted;
    };

    return ;
});