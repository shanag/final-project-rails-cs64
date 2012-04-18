Views.Legend = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    this.range = options.range;
    this.linear_scale = options.linear_scale;
    this.log_scale = options.log_scale;
    this.q_scale = options.q_scale;
    this.q_ticks = this.q_scale.quantiles();
    this.q_ticks.push(0);
    this.q_ticks.sort(function(a, b){ return (a-b) }); //sort ascending;
    var interval = (MapApp.outbreaks_min + 500) / this.range.length;
    this.linear_ticks = [];
    for (i in this.range) {
      this.linear_ticks.push(MapApp.outbreaks_min + (i * interval));
    }
    this.space = 5;
    this.rect_width = 35;
    this.legend_height = 50;
  },
  
  template: function() {
    return JST['legend'];
  },

  onRender: function() {
    //setup legend
    var svg = d3.select("#chart svg");
    var range = this.range;
    var legend_width = (this.rect_width + this.space) * range.length; 

    this.legend = svg.append("g")
      .attr("id", "legend");
  },

  drawLegend: function(selected_scale) {
    var space = this.space; //duplicated because of context problem
    var rect_width = this.rect_width;
    var svg = d3.select("#chart svg");
    var width = svg.style("width").replace("px", "");
    var height = svg.style("height").replace("px", "");
    var legend_height = this.legend_height;
    var legend_width = (rect_width + space) * this.range.length; 
    var range = [];
    var label_ticks = [];
    var log_scale = this.log_scale;

    //remove old rects and text 
    this.legend.selectAll("rect").remove();
    this.legend.selectAll("text").remove();
   
    if (selected_scale == "log") {
      range = this.range;
      label_ticks = this.q_ticks;
    } else {
      range = this.range;
      label_ticks = this.linear_ticks;
    }
    
    //set up legend class
    this.legend.classed("Reds", true);

    //draw new rects
    this.legend.selectAll("rect")
      .data(range)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
          return (width-legend_width) + (rect_width * i);
        })
      .attr("y", height - legend_height + 10)
      .attr("width", rect_width)
      .attr("height", 15)
      .attr("class", function(d, i) { return "q" + d + "-9"}); 
    
    //draw ticks
    this.legend.selectAll("text")
      .data(label_ticks)
      .enter()
      .append("text")
      .text(function(d, i) {
        var text = "";
        if (selected_scale == "log") {
          text = log_scale.invert(d).toFixed(1); //invert the scale to get the original num adjusted illnesses
        } else {
          text = d.toFixed(1);
        }
        if (i == range.length-1) {
          return ">" + text;
        } else {
          return text; 
        }})
      .style("font-size", "10")
      .attr("x", function(d, i) {
          if (i == range.length-1) {
            return (width-legend_width) + (rect_width * i) - this.getComputedTextLength()/3;
          } else {
            return (width-legend_width) + (rect_width * i) - this.getComputedTextLength()/2;
          }})
      .attr("y", height - legend_height + 40);
    
    //draw title
    this.legend.append("text")
      .text("Number of Illnesses per 100,000 people*")
      .style("font-weight", "bold")
      .style("font-size", "12")
      .attr("x", function() { return width - legend_width})
      .attr("y", function() { return height - legend_height});
  }
});



