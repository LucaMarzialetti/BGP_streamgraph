/**
 * The location of the widget
 */
WIDGET_URL = ((typeof EXTERNAL_WIDGET_URL == 'undefined') ? "" : EXTERNAL_WIDGET_URL) ;

/**
 * Name space configuration
 */
window.atlas = window.atlas || {};
window.atlas._widgets = window.atlas._widgets || {};
window.atlas._widgets.impcrashes = window.atlas._widgets.impcrashes || {};
window.atlas._widgets.impcrashes.urls = window.atlas._widgets.impcrashes.urls || {
        libs: WIDGET_URL + "dev/libs/",
        env: WIDGET_URL + "dev/environment/",
        connector: WIDGET_URL + "dev/connector/",
        model: WIDGET_URL + "dev/model/",
        view: WIDGET_URL + "dev/view/",
        controller: WIDGET_URL + "dev/controller/",
        session: WIDGET_URL + "dev/session/"
    };
window.atlas._widgets.impcrashes.instances = window.atlas._widgets.impcrashes.instances || {
        requested: [],
        running: {},
        callback: {}
    };


if (!window.atlas._widgets.widgetInjectorRequested) { // Only one injector
    window.atlas._widgets.widgetInjectorLoaded = false;
    window.atlas._widgets.widgetInjectorRequested = true;
    window.atlas._widgets.impcrashes.tmp_scripts = document.getElementsByTagName('script');
    window.atlas._widgets.impcrashes.tmp_scrip = window.atlas._widgets.impcrashes.
        tmp_scripts[window.atlas._widgets.impcrashes.tmp_scripts.length - 1];
    window.atlas._widgets.injectorScript = document.createElement('script');
    window.atlas._widgets.injectorScript.async = false;
    window.atlas._widgets.injectorScript.src = window.atlas._widgets.impcrashes.urls.libs + 'require.min.js';
    window.atlas._widgets.impcrashes.tmp_scrip.parentNode.appendChild(window.atlas._widgets.injectorScript);
}

/**
 * Widget injector
 */
function initWidget(domElement, instanceParams, queryParams){
    var run;

    run = function(){
        var instances, instance;

        instances = window.atlas._widgets.impcrashes.instances;
        instance = instances.requested.shift();

        while (instance){
            (function(instances, instance){
                requirejs.config({
                    waitSeconds: 60
                });
                if (instance.instanceParams.dev) { // Load dev version
                    require([WIDGET_URL + 'impcrashes-loader.js'], function(Widget){
                        instances.running[instance.domElement] = Widget(instance);
                    });
                } else { // Load deployed version
                    require([WIDGET_URL + 'impcrashes-dist.js'], function () {
                        require(['impcrashes-loader'], function(Widget){
                            instances.running[instance.domElement] = Widget(instance);
                        });
                    });
                }
            })(instances, instance);


            instance = instances.requested.shift();
        }
    };

    window.atlas._widgets.impcrashes.instances.callback[domElement] = null;
    window.atlas._widgets.impcrashes.instances.requested
        .push({ domElement: domElement, instanceParams: instanceParams, queryParams: queryParams, callbacks: {} });

    if (document.readyState == 'complete'){
        window.atlas._widgets.widgetInjectorLoaded = true;
    } else {

        function ieLoadBugFix(){
            if (!window.atlas._widgets.widgetInjectorLoaded){
                if (document.readyState=='loaded' || document.readyState=='complete') {
                    window.atlas._widgets.injectorScript.onload();
                }else {
                    setTimeout(ieLoadBugFix, 200);
                }
            }
        }

        ieLoadBugFix();
    }

    if (window.atlas._widgets.widgetInjectorLoaded === false){
        window.atlas._widgets.injectorScript.onload = function(){
            window.atlas._widgets.widgetInjectorLoaded = true;
            run();
        };
    } else {
        run();
    }

    return {
        ready: function(callback){
            window.atlas._widgets.impcrashes.instances.callback[domElement] = callback;
        },
        shell: function(){
            var instance = window.atlas._widgets.impcrashes.instances.running[domElement];

            if (instance) {
                return instance;
            } else {
                throw "Widget not loaded yet. Try again in a few seconds."
            }
        }
    };
}
