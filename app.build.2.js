({
    baseUrl : ".",
    findNestedDependencies: true,
    preserveLicenseComments: false,

    name: 'impcrashes-loader',

    paths:{
        "impcrashes.env.utils": "dev/environment/utils",
        "impcrashes.env.config": "dev/environment/config",
        "impcrashes.env.languages.en": "dev/environment/languages/language.eng",

        /* libs */
        "impcrashes.lib.require": "dev/libs/require.min",
        "impcrashes.lib.jquery-amd": "dev/libs/jquery-libs-amd",
        "impcrashes.lib.jquery-libs": "dev/libs/jquery-libs",
        "impcrashes.lib.date-format": "dev/libs/dateFormat",
        "impcrashes.lib.d3-amd": "dev/libs/d3/js/d3.v3.amd",
        "impcrashes.lib.mustache": "dev/libs/mustache",
        "impcrashes.lib.text": "dev/libs/require-text",
        "impcrashes.lib.stache": "dev/libs/stache",
        "impcrashes.lib.colorbrewer": "dev/libs/colorbrewer",
        "impcrashes.lib.d3.legend": "dev/libs/d3.legend",


        /* view */
        "impcrashes.view.main": "dev/view/MainView",
        "impcrashes.view.map": "dev/view/MapView",
        "impcrashes.view.table": "dev/view/TableView",
        "impcrashes.view.bar-chart": "dev/view/BarChartView",


        /* controller */
        "impcrashes.controller.main": "dev/controller/main",



        /* connector */
        "impcrashes.connector.facade": "dev/connector/ConnectorFacade",
        "impcrashes.connector.translation": "dev/connector/TranslationConnector",
        "impcrashes.connector.rest": "dev/connector/RestConnector",

    },
    shim:{
    },
    stache: {
        extension: '.html', // default = '.html'
        path: 'dev/view/html/' // default = ''
    },
    stubModules: ["impcrashes.lib.text", "impcrashes.lib.stache"],
    removeCombined: true,
    optimize: "uglify2",//uglify2
    wrapShim: false,
    generateSourceMaps: false,

    out: "impcrashes-dist.js"


})