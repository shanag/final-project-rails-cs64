Views.Barchart = Backbone.Marionette.ItemView.extend({

  initialize: function(options) {
    this.max_labelWidth = 125;
    this.height = 125;
    this.labels = ["label1 is a very long label", "label2", "label3", "label4", "label5"];
  },
  
  template: function() {
    return JST['barchart'];  
  },
 
  drawBarChart: function(chart_type, data) {
    var width = d3.select("#" + chart_type).style("width").replace("px", "");
    var rect_height = (this.height*1.0)/data.length;
  
    this.chart_container = d3.select("#" + chart_type)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width)
      .attr("height", rect_height * data.length + 10)//10 for stroke
      .append("g")
      .attr("transform", "translate("+ this.max_labelWidth +", 0)")
      .attr("width", function() { width - this.max_labelWidth});
    
    //maps input values (domain) to output values (range) for this particular chart
    var x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, width-this.max_labelWidth]);
    
    //draw bars
    this.chart_container.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function() {
        if (chart_type == "food") { return "#666666" }
        if (chart_type == "location") { return "#333333" }
        if (chart_type == "etiology") { return "#000000" }
      })
      .attr("y", function(d, i) { return i * rect_height; })
      .attr("width", x)
      .attr("height", rect_height);
    
    //draw values
    this.chart_container.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(function(d) { return d; })
      .attr("x", x)
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; })
      .attr("dx", 20) //padding
      .attr("dy", ".35em") //vertical-align
      .style("font-size", "10")
      .style("fill", "#333333")
      .attr("text-anchor", "end");

    //draw labels
    this.label_container = d3.select("#" + chart_type)
      .select("svg")
      .append("g")
      .attr("class", "label-container")
      .attr("transform", "translate("+ (this.max_labelWidth-5) +", 0)"); //-5 for padding
  },

  //only updates the values that need to be updated for each chart
  redrawBarChart: function(chart_type, items) {
    //sort items to find top 5
    var sortable = [];  
    for (var key in items) {
      sortable.push([key, items[key]])
    }
    sortable.sort(function(a, b) { return b[1] - a[1]} );

    //set vars
    this.labels = _.first(_.map(sortable, function(arr) {return arr[0];}), 5);
    var data = _.first(_.map(sortable, function(arr) {return arr[1];}), 5); 
    var width = d3.select("#" + chart_type).style("width").replace("px", "");
    var rect_height = this.height/data.length;
  
    //maps input values (domain) to output values (range) for this particular chart
    var x = d3.scale.linear()
      //.domain([0, d3.max("MapApp." + chart_type + "_max")])//max value for each measure: food, etiologies, locations
      .domain([0, 560])
      .range([0, width-this.max_labelWidth]);
    
    //draw bars with values
    this.chart_container.selectAll("rect")
      .data(data)
      .attr("width", x);
    
    //draw values
    this.chart_container.selectAll("text")
      .data(data)
      .text(function(d) { return d; })
      .attr("x", x)
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; });

    //draw labels
    this.label_container.selectAll("text")
      .remove(); //remove old and append new below

    this.label_container.selectAll("text")
      .data(this.labels)
      .enter()
      .append("text")
      .attr("class", "data-label")
      .text(function(d) { return d; })
      .style("font-size", "12")
      .attr("x", function(d, i) { return 0 - this.getComputedTextLength(); })
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2 + 3; });
  }

});
