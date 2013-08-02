var ChartOptionsModel = Backbone.Model.extend({

    defaults: {
        barTabsContent: '',
        element: {
            bars: {
                color: "barColorValue",
                backgroundColor: "barBgColorValue"
            },
            common: {
                marker: { id: "pollMarker", checked: '', text: 'Marker' },
                scale: { id: "pollScale", checked: '', text: 'Scale' },
                needle: { id: "pollNeedle", checked: '', text: 'Needle' },
                spindle: { id: "pollSpindle", checked: '', text: 'Spindle' }
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
        }
    },
    initialize: function()
    {

    }
});