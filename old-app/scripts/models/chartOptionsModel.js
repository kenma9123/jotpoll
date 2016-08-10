var ChartOptionsModel = Backbone.Model.extend({

    defaults: {
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
        bar_names: ['Option1','Option2','Option3','Option4','Option5'],
        poll: {
            type: 'gauge',
            bars: [
                { value: 90, offset: 0, color: "#9deb00", backgroundColor:"#c2fc92", text: { indent: 10 } },
                { value: 80, offset: 45, color: "#0095ff", backgroundColor:"#ade0ff", text: { indent: 10 } },
                { value: 70, offset: 90, color: "#fa7900", backgroundColor:"#facba0", text: { indent: 10 } },
                { value: 60, offset: 135, color: "#6849e3", backgroundColor:"#d4b0ff", text: { indent: 10 } },
                { value: 50, offset: 180, color: "#eb0527", backgroundColor:"#fac0c0", text: { indent: 10 } }
            ],
            markers: [],
            rangeContainer: {
                backgroundColor: "none"
            },
            commonRangeBarSettings: {
                size: 40, //+5 to second offset and add it to the rest
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
        
    },

    getPollData_Defaults: function()
    {
        return JSON.parse($.jStorage.get('poll_defaults', false));
    },

    savePollData_Defaults: function()
    {
        //save some default options to storage
        var poll = JSON.stringify(this.get('poll'))
        $.jStorage.set('poll_defaults', poll); // expires in 1 day
    }
});