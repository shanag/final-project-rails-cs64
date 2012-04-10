Views.Visualization = Backbone.Marionette.ItemView.extend({

  className: "viz",

  initialize: function(options) {
    this.data = options.data;
  },
  
  events: {
    "change #min": "setSliderMinVal",
    "change #max": "setSliderMaxVal",
    "valuesChanging #slider" : "setInputs"
  },
  
  template: function() {
    return JST['visualization'];
  },

  onShow: function() {
    this.drawMap();
    this.drawBarChart("food", [1, 1, 1, 1, 1]); //placeholder data to initialize svg elements
    this.drawBarChart("etiology", [1, 1, 1, 1, 1]);
    this.drawBarChart("location", [1, 1, 1, 1, 1]);
    this.initializeSlider();
    this.colorMap(); 
  },

  initializeSlider: function() {
    $("#min").datepicker({
      maxDate: new Date(2009,11,31),//--hard coded dates
      minDate: new Date(2008,0,1),//--hard coded dates
      dateFormat: "yy-mm-dd",
      buttonImage: "/assets/calendar.png",
      buttonImageOnly: true,
      buttonText: "Choose a date",
      showOn: "both"
    }); 
    
    $("#max").datepicker({
      maxDate: new Date(2009,11,31),//--hard coded dates
      minDate: new Date(2008,0,1),//--hard coded dates
      dateFormat: "yy-mm-dd",
      buttonImage: "/assets/calendar.png",
      buttonImageOnly: true,
      buttonText: "Choose a date",
      showOn: "both"
    }); 
    
    this.slider = $("#slider").dateRangeSlider({
      bounds: {
        min: 1199163600000, // January 1, 2008 --hard coded dates
        max: 1262235600000 // December 31, 2009 --hard coded dates
      },
      arrows: false,
      valueLabels: "show"
    });

    var tick = $("#slider").width()/23;
    var start = $("#slider").position().left;
    $("ul.rule li").each(function(idx, elem) {
      if (idx == 1) { $(elem).position().left = start + tick};
      $(elem).position().left = start + (tick*idx);
    }); 
  },

  setSliderMinVal: function(e) {
    $("#slider").dateRangeSlider("min", $("#min").datepicker("getDate"));
    this.colorMap();
  },
  
  setSliderMaxVal: function(e) {
    $("#slider").dateRangeSlider("max", $("#max").datepicker("getDate"));
    this.colorMap();
  },
 
  setInputs: function(e) {
    $("#min").datepicker("setDate", $("#slider").dateRangeSlider("min"));
    $("#max").datepicker("setDate", $("#slider").dateRangeSlider("max"));
    this.colorMap();
  },

  drawMap: function() {
    var path = d3.geo.path();
    var svg = d3.select("#chart").append("svg");
   
    this.counties = svg.append("g")
      .attr("id", "counties")
      .attr("class", "Reds");

    this.states = svg.append("g")
      .attr("id", "states");
        
    //counties
    this.counties.selectAll("path")
      .data(MapApp.counties.features)
      .enter()
      .append("path")
      .attr("class", "bg-path-color")
      .attr("id", function(d) { return "fips_" + d.id; }) 
      .attr("d", path);

    //states
    this.states.selectAll("path")
      .data(MapApp.states.features)
      .enter()
      .append("path")
      .attr("d", path);
  },

  colorMap: function() {
    var data = this.data;
    var q_scale;
    var start_date = $("#min").datepicker("getDate");
    var end_date = $("#max").datepicker("getDate");
    var commodities = [5, 2, 15, 64, 43]; //placeholder data
    var locations = [5, 2, 15, 64, 43]; //placeholder data
    var etiologies = [5, 2, 15, 64, 43]; //placeholder data
    
    q_scale = d3.scale.quantile().domain([MapApp.outbreaks_min, MapApp.outbreaks_max]).range([1,2,3,4,5,6,7,8]);

    for (fips in data) {
      if (Date.parse(data[fips]["first_illness"]) >= Date.parse(start_date) && Date.parse(data[fips]["last_illness"]) <= Date.parse(end_date)) {
        this.counties.select("#fips_"+fips)
          .attr("class", quantize)
          .on("mouseover", function(d){
            d3.select(this).attr("class", "county-hover");
            var mouse_pos = d3.mouse(this);
            var first_illness = Date.parse(data[d.id]["first_illness"]);
            var last_illness = Date.parse(data[d.id]["last_illness"]);
            d3.select(".tooltip") 
              .style("left", mouse_pos[0] + "px")
              .style("top", mouse_pos[1] + "px")
              .style("visibility", "visible")
              .html(
                "<ul><li><p class='title'>(Etiology) Outbreak</p></li>" 
                + "<ul><li><p class='date'>"+ first_illness.toString("MMMM d, yyyy") + " - " + last_illness.toString("MMMM d, yyyy") + "</p></li>"
                + "<li><span>Duration:</span><span>" + data[d.id]["duration"] + " days" 
                + "</span></li><li><span>Reporting County:</span><span>" + data[d.id]["reporting_county"] + " County"
                + "</span></li><li><span>Illnesses:</span><span>" + data[d.id]["illnesses"]
                + "</span></li><li><span>Hospitalizations:</span><span>" + data[d.id]["hospitalizations"]
                + "</span></li><li><span>Commodity:</span><span>" + data[d.id]["commodity_group"] + "</span></li></ul>" 
              );
          })
          .on("mouseout", function(){
            d3.select(this).attr("class", data ? quantize : null);
            d3.select(".tooltip")
              .style("visibility", "hidden")
              .text("");
          });
      } else {
        this.counties.select("#fips_"+fips)
          .attr("class", "bg-path-color") 
      }
    }
    
    this.redrawBarChart("food", commodities);
    this.redrawBarChart("etiology", locations);
    this.redrawBarChart("location", etiologies);
    
    function quantize(d) {
      //Double bitwise "not" to convert float to integer. Came with the d3 example code.
      //See: http://rocha.la/JavaScript-bitwise-operators-in-practice for explanation
      return "q" + q_scale(~~(data[d.id]["adjusted_illnesses"])) + "-9";
    }
  },

  drawBarChart: function(chart_type, data) {
    var labels = ["label1 is a very long label", "label2", "label3", "label4", "label5"];
    var max_labelWidth = 125; 
    var width = d3.select("#" + chart_type).style("width").replace("px", "");
    var height = 150;
    var title_height = d3.select("#" + chart_type + " h4").style("height").replace("px", "");
    var rect_height = (height-title_height)/data.length;
  
    var chart_container = d3.select("#" + chart_type)
      .append("svg")
      .attr("class", "chart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+ max_labelWidth +", 0)")
      .attr("width", function() { width - max_labelWidth});
    
    //maps input values (domain) to output values (range) for this particular chart
    var x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, width-max_labelWidth]);
    
    //draw bars
    chart_container.selectAll("rect")
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
    chart_container.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(function(d) { return d; })
      .attr("x", x)
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; })
      .attr("dx", -3) //padding
      .attr("dy", ".35em") //vertical-align
      .style("font-size", "8")
      .style("fill", "#FFFFFF")
      .attr("text-anchor", "end");

    //draw labels
    var label_container = d3.select("#" + chart_type)
      .select("svg")
      .append("g")
      .attr("transform", "translate("+ (max_labelWidth-5) +", 0)"); //-5 for padding
    
    label_container.selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .attr("class", "data-label")
      .text(function(d) { return d; })
      .style("font-size", "11")
      .attr("x", function(d, i) { return 0 - this.getComputedTextLength(); })
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; });
  },

  //only updates the values that need to be updated for each chart
 redrawBarChart: function(chart_type, data) {
    var labels = ["label1 is a very long label", "label2", "label3", "label4", "label5"];
    var max_labelWidth = 125; 
    var width = d3.select("#" + chart_type).style("width").replace("px", "");
    var height = 150;
    var title_height = d3.select("#" + chart_type + " h4").style("height").replace("px", "");
    var rect_height = (height-title_height)/data.length;
  
    var chart_container = d3.select("#" + chart_type)
      .select("svg")
      .select("g")
      .attr("transform", "translate("+ max_labelWidth +", 0)")
      .attr("width", function() { width - max_labelWidth});
    
    //maps input values (domain) to output values (range) for this particular chart
    var x = d3.scale.linear()
      .domain([0, d3.max(data)])//need max values for each measure: food, etiologies, locations
      .range([0, width-max_labelWidth]);
    
    //draw bars
    chart_container.selectAll("rect")
      .data(data)
      .attr("y", function(d, i) { return i * rect_height; })
      .attr("width", x)
      .attr("height", rect_height);
    
    //draw values
    chart_container.selectAll("text")
      .data(data)
      .text(function(d) { return d; })
      .attr("x", x)
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; })
      .attr("dx", -3) //padding
      .attr("dy", ".35em"); //vertical-align

    //draw labels
    var label_container = d3.select("#" + chart_type)
      .select("svg")
      .select("g")
      .attr("transform", "translate("+ (max_labelWidth-5) +", 0)"); //-5 for padding
    
    label_container.selectAll("text")
      .data(labels)
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return 0 - this.getComputedTextLength(); })
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; });
  }
});
