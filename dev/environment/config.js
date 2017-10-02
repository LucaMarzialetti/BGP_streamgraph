/**
 * Change configs here.
 */

define([], function(){

    /**
     * Configuration file
     */

    return {
        widgetPrefix: "ic",
        dataAPIs:{
            main: "data/annotatedData.json"  
        },
        
        style: {
            colorRange: ["#FEE8c8", "#B30000"],
            barChart: {
                margin: { top: 20, right: 20, bottom: 70, left: 40, label: 7 },
                width: 1000,
                height: 200
            },
            map: {
                width: 660,
                height: 500
            },
            legend: {
                width: 20,
                height: 300,
                margin: {
                    left: 20,
                    top: 20
                },
                marginLabel: 30
            }
        }
        
    };
});
