({
    baseUrl : ".",
    findNestedDependencies: true,
    preserveLicenseComments: false,

    wrap: {
        start: "define([], function(){" +
        "define.amd=false;",
        end: "});"
    },

    include: [
        "bgpst.lib.moment",
        "bgpst.lib.jquery",
        "bgpst.lib.jquery-ui",
        "bgpst.lib.bootstrap",
        "bgpst.lib.bootstrap.datetimepicker",
        "bgpst.lib.bootstrap.validator",
        "bgpst.lib.bootstrap.validator-it",
        "bgpst.lib.bootstrap.tokenfield"
    ],

    paths: {
        "bgpst.lib.moment": "dev/libs/moment/2.18.1/moment.min",
        "bgpst.lib.jquery": "dev/libs/jquery/jquery-1.11.1.min",
        "bgpst.lib.jquery-ui": "dev/libs/jquery_ui/1.12.1/jquery-ui.min",
        "bgpst.lib.bootstrap": "dev/libs/bootstrap/js/bootstrap.min",
        "bgpst.lib.bootstrap.datetimepicker": "dev/libs/datetimepicker/4.17.47/bootstrap-datetimepicker.min",
        "bgpst.lib.bootstrap.validator": "dev/libs/form_validator/0.5.3/bootstrapValidator.min",
        "bgpst.lib.bootstrap.validator-it": "dev/libs/form_validator/0.5.3/it_IT",
        "bgpst.lib.bootstrap.tokenfield": "dev/libs/tokenfield/0.12.0/bootstrap-tokenfield.min"
    },

    shim: {
        "bgpst.lib.bootstrap": {
            deps: ["bgpst.lib.jquery"]
        },
        "bgpst.lib.jquery-ui": {
            deps: ["bgpst.lib.jquery"]
        },
        "bgpst.lib.bootstrap.datetimepicker": {
            deps: ["bgpst.lib.bootstrap", "bgpst.lib.moment"]
        },
        "bgpst.lib.bootstrap.validator": {
            deps: ["bgpst.lib.bootstrap"]
        },
        "bgpst.lib.bootstrap.tokenfield": {
            deps: ["bgpst.lib.bootstrap"]
        },
        "bgpst.lib.bootstrap.validator-it": {
            deps: ["bgpst.lib.bootstrap.validator"]
        }
    },

    optimize: "none",
    wrapShim: false,
    generateSourceMaps: false,
    out: "dev/libs/jquery-libs.2.js"

})