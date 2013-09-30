var PreviewChartModel = Backbone.Model.extend({

    defaults: {
        totalBar: 5,
        bars: [ //default data to display on preview
            {value: 62, offset: 0, indent: 10},
            {value: 75, offset: 35, indent: 10,},
            {value: 38, offset: 70, indent: 10},
            {value: 83, offset: 105, indent: 10},
            {value: 90, offset: 140, indent: 10},
        ],
        common: {
            marker: {
                visible: true
            },
            scale: {
                label: {
                    visible: true
                } 
            }
        }
	}
});