requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts',
    paths: {
        form: 'interface/form',
        streamgraph: 'interface/streamgraph_drawer',
        ripestatwrap: 'interface/ripe_stat_wrap'
    }
});


requirejs(["form, streamgraph, ripestatwrap"], function(form, streamgraph, ripestatwrap) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});
