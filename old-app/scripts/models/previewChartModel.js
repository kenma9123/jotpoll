var PreviewChartModel = Backbone.Model.extend({

    defaults: {
        totalBar: 5,
        bars: [ //default data to display on preview
            {value: 90, offset: 0, indent: 10},
            {value: 80, offset: 45, indent: 10,},
            {value: 70, offset: 90, indent: 10},
            {value: 60, offset: 135, indent: 10},
            {value: 50, offset: 180, indent: 10},
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