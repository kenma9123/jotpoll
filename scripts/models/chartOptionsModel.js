var ChartOptionsModel = Backbone.Model.extend({

    defaults: {
        barTabsContent: '',
        element: {
            chart: {
                gauge: { id: "gaugePreview", checked: true},
                linear: { id: "linearPreview", checked: false}
            },
            bars: {
                color: "barColorValue",
                backgroundColor: "barBgColorValue"
            },
            common: {
                scale: { id: "pollScale", checked: false, invisible: false, text: 'Scale' },
                marker: { id: "pollMarker", checked: false, invisible: false,  text: 'Marker' }
            }
        },
        poll: {
            type: 'gauge',
            bars: [
                { value: 75, offset: 0, color: "#A6C567", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 75, offset: 35, color: "#3498db", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 37, offset: 70, color: "#FD8F29", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 65, offset: 105, color: "#806ae1", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 90, offset: 140, color: "#f4314f", backgroundColor:"#e3e3e3", text: { indent: 10 } }
            ],
            markers: [],
            rangeContainer: {
                backgroundColor: "none"
            },
            commonRangeBarSettings: {
                size: 30,
                backgroundColor: "#F0F0F0"
            },
            common: {
                offsetVal: 35,
                barSize: 30,
                marker: {
                    visible: true
                },
                scale: {
                    startValue: 0,
                    endValue: 100,
                    majorTick: {
                        color: "#c9c9c9",
                        width: 0
                    },
                    label: {
                        visible: true
                    } 
                }
            }
        },
        cookies: {
            name: 'pollOptions',
            value: {}
        }
    },
    initialize: function()
    {

    }
});