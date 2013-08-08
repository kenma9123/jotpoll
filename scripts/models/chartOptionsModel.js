var ChartOptionsModel = Backbone.Model.extend({

    defaults: {
        barTabsContent: '',
        element: {
            chart: {
                gauge: { id: "gaugePreview", checked: false},
                linear: { id: "linearPreview", checked: true}
            },
            bars: {
                color: "barColorValue",
                backgroundColor: "barBgColorValue"
            },
            common: {
                scale: { id: "pollScale", checked: false, invisible: false, text: 'Scale' },
                marker: { id: "pollMarker", checked: false, invisible: true,  text: 'Marker' },
                needle: { id: "pollNeedle", checked: false, invisible: true, text: 'Needle' },
                spindle: { id: "pollSpindle", checked: false, invisible: true, text: 'Spindle' }
            }
        },
        poll: {
            type: 'linear',
            bars: [
                { value: 75, offset: 0, color: "#A6C567", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 75, offset: 35, color: "#3498db", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 37, offset: 70, color: "#FD8F29", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 65, offset: 105, color: "#806ae1", backgroundColor:"#e3e3e3", text: { indent: 10 } },
                { value: 90, offset: 140, color: "#f4314f", backgroundColor:"#e3e3e3", text: { indent: 10 } }
            ],
            markers: [],
            needles: [],
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
                },
                needle: {
                    visible: false
                },
                spindle: {
                    visible: true,
                    color: "#C2C2C2"
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