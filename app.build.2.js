({
    baseUrl : ".",
    findNestedDependencies: true,
    preserveLicenseComments: false,

    name: 'bgpst-loader',

    paths:{
        "bgpst.env.utils": "dev/environment/utils",
        "bgpst.env.config": "dev/environment/config",
        "bgpst.env.languages.en": "dev/environment/languages/language.eng",

        /* libs */
        "bgpst.lib.require": "dev/libs/require.min",
        "bgpst.lib.jquery-amd": "dev/libs/jquery-libs-amd",
        "bgpst.lib.jquery-libs": "dev/libs/jquery-libs",
        "bgpst.lib.date-format": "dev/libs/dateFormat",
        "bgpst.lib.d3-amd": "dev/libs/d3/js/d3.v3.amd",
        "bgpst.lib.mustache": "dev/libs/mustache",
        "bgpst.lib.text": "dev/libs/require-text",
        "bgpst.lib.stache": "dev/libs/stache",
        "bgpst.lib.colorbrewer": "dev/libs/colorbrewer",
        "bgpst.lib.d3.legend": "dev/libs/d3.legend",


        /* view */
        "bgpst.view.main": "dev/view/MainView",
        "bgpst.view.map": "dev/view/MapView",
        "bgpst.view.table": "dev/view/TableView",
        "bgpst.view.bar-chart": "dev/view/BarChartView",


        /* controller */
        "bgpst.controller.main": "dev/controller/main",



        /* connector */
        "bgpst.connector.facade": "dev/connector/ConnectorFacade",
        "bgpst.connector.translation": "dev/connector/TranslationConnector",
        "bgpst.connector.rest": "dev/connector/RestConnector",

    },
    shim:{
    },
    stache: {
        extension: '.html', // default = '.html'
        path: 'dev/view/html/' // default = ''
    },
    stubModules: ["bgpst.lib.text", "bgpst.lib.stache"],
    removeCombined: true,
    optimize: "uglify2",//uglify2
    wrapShim: false,
    generateSourceMaps: false,

    out: "bgpst-dist.js"


})