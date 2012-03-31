Views.Visualization = Backbone.Marionette.ItemView.extend({

  template: function() {
    return JST['visualization'];
  },

  onShow: function() {
    this.drawMap();
    this.slider = $("#slider").slider();
    this.drawFoodChart();
  }, 

  drawMap: function() {
    var data; 

    var path = d3.geo.path();

    var svg = d3.select("#chart")
        .append("svg");

    var counties = svg.append("g")
        .attr("id", "counties")
        .attr("class", "Blues");

    var states = svg.append("g")
        .attr("id", "states");

    d3.json('/api/counties', function(json) {
      counties.selectAll("path")
        .data(json.features)
        .enter().append("path")
        .attr("class", data ? quantize : null)
        .attr("d", path)
        .on("mouseover", function(){
          d3.select(this).attr("class", "q8-9");
        })
        .on("mouseout", function(){
          d3.select(this).attr("class", data ? quantize : null);
        });
    });

    d3.json('/api/states', function(json) {
      states.selectAll("path")
        .data(json.features)
        .enter().append("path")
        .attr("d", path);
    });

    d3.json('/api/unemployments', function(json) {
      data = json;
      counties.selectAll("path")
        .attr("class", quantize);
    });

    function quantize(d) {
      return "q" + Math.min(8, ~~(data[d.id] * 9 / 12)) + "-9";
    }
  },

  drawFoodChart: function() {
  
  }
});
