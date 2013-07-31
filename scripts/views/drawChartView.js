var DrawChartView = Backbone.View.extend({

    initialize:function()
    {
        var self = this;

        Backbone.on('call-drawChart', function(){
            console.log('drawchart call');
        });
    },

    /**
     * setup the gauge chart Data
     */
    setupGaugeChart: function(cb)
    {
        //variables
        var gauge = this.global.chartOptionsModel.get('gauge')
          , tempMarkers = []
          , tempNeedles = [];

        $.each(gauge.bars, function(index, value){
            //if markers is visible, removed text indent
            if ( gauge.common.marker.visible === true )
            {
                gauge.bars[index].text.indent = 0;

                //build marker arrays, from gauge data
                var markerObject = {
                    value: gauge.bars[index].value,
                    offset: gauge.bars[index].offset,
                    color: gauge.bars[index].color,
                    length: 30,
                    type: 'textCloud'
                };

                tempMarkers.push(markerObject);
            }
            else
            {
                //add indent
                gauge.bars[index].text.indent = 10;
            }
        });

        //set markers
        gauge.markers = tempMarkers;

        //if needle is visible, only attach it to the highest data
        if ( gauge.common.needle.visible == true )
        {
            //get the highest data from the updated gauge
            var mapped = $.map(gauge.bars,function(item){return item['value'];})
              , max = Math.max.apply(null, mapped)
              , i = mapped.indexOf(max);

            var needleObject = {
                value: gauge.bars[i].value,
                color: gauge.bars[i].color,
                type:'triangle'
            };

            tempNeedles.push(needleObject);
        }

        //set needles
        gauge.needles = tempNeedles;

        //update gauge
        this.global.chartOptionsModel.set('gauge', gauge);
        // console.log('final', this.global.chartOptionsModel.get('gauge'));

        if (cb) cb();
    }
});