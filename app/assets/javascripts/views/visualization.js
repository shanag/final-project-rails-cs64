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
    var commodities = {};
    var locations = {};
    var etiologies = {};
    
    q_scale = d3.scale.quantile().domain([MapApp.outbreaks_min, MapApp.outbreaks_max]).range([1,2,3,4,5,6,7,8]);
    
    for (fips in data) {
      var total_adjusted_illnesses = 0;
      //for each fips, filter outbreaks by selected time range
      _.each(data[fips], function(outbreak) {
        if (Date.parse(outbreak["first_illness"]) >= Date.parse(start_date) && Date.parse(outbreak["last_illness"]) <= Date.parse(end_date)) {
          //total illnesses
          total_adjusted_illnesses += parseFloat(outbreak["adjusted_illnesses"]); 
          
          //add commodity
          (outbreak["commodity_group"] in commodities) ? commodities[outbreak["commodity_group"]] += 1 : commodities[outbreak["commodity_group"]] = 1;
          
          //add etiology genus
          (outbreak["etiology_genus"] in etiologies) ? etiologies[outbreak["etiology_genus"]] += 1 : etiologies[outbreak["etiology_genus"]] = 1;

          //add where eaten locations
          _.each(outbreak["consumption_locations"], function(loc) { 
            (loc in locations) ? locations[loc] += 1 : locations[loc] = 1;
          });
        }
      }, this);

      //color county
      this.counties.select("#fips_"+fips)
        .attr("class", function() { 
          if (total_adjusted_illnesses > 0) {
            return "q" + q_scale(~~total_adjusted_illnesses) + "-9";
          } else {
            return "bg-path-color";
          }
        }); 
      
      //add hover to this county
      this.addHover(fips, data[fips]);
    }
   
    this.redrawBarChart("food", commodities);
    this.redrawBarChart("etiology", etiologies);
    this.redrawBarChart("location", locations);
  },

  addHover: function(fips, outbreaks) {
    this.counties.select("#fips_"+fips)
      .on("mouseover", function(d){
        d3.select(this).classed("county-hover", true);
        var mouse_pos = d3.mouse(this);
        var tooltip = d3.select(".tooltip") 
          .style("left", mouse_pos[0] + "px")
          .style("top", mouse_pos[1] + "px")
          .style("visibility", "visible");

        tooltip.selectAll("ul")
          .data(outbreaks)
          .enter()
          .append("ul")
          .html(function(d){
            var first_illness = d["first_illness"] ? Date.parse(d["first_illness"]).toString("MMMM d, yyyy") : "unknown"; 
            var last_illness = d["last_illness"] ? Date.parse(d["last_illness"]).toString("MMMM d, yyyy") : "unknown";
            return "<li><p class='title'>Outbreak - " + d["etiology_genus"] + "</p></li>" 
              + "<ul><li><p class='date'>"+ first_illness + " - " + last_illness + "</p></li>"
              + "<li><span>Duration:</span><span>" + d["duration"] + " days" 
              + "</span></li><li><span>Reporting County:</span><span>" + d["reporting_county"] + " County"
              + "</span></li><li><span>Illnesses:</span><span>" + d["illnesses"]
              + "</span></li><li><span>Hospitalizations:</span><span>" + d["hospitalizations"]
              + "</span></li><li><span>Commodity:</span><span>" + d["commodity_group"] + "</span></li>"; 
          });
      })
      .on("mouseout", function(){
        d3.select(this).classed("county-hover", false);
        d3.select(".tooltip")
          .style("visibility", "hidden")
          .selectAll("ul")
          .remove();
      });
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
      .attr("class", "label-container")
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
  redrawBarChart: function(chart_type, items) {
    //sort items to find top 5
    var sortable = [];  
    for (var key in items) {
      sortable.push([key, items[key]])
    }
    sortable.sort(function(a, b) { return b[1] - a[1]} );

    //set vars
    var labels = _.first(_.map(sortable, function(arr) {return arr[0];}), 5);
    var data = _.first(_.map(sortable, function(arr) {return arr[1];}), 5); 
    var max_labelWidth = 125; 
    var width = d3.select("#" + chart_type).style("width").replace("px", "");
    var height = 150;
    var title_height = d3.select("#" + chart_type + " h4").style("height").replace("px", "");
    var rect_height = (height-title_height)/data.length;
  
    //define bar chart container (in markup)
    var chart_container = d3.select("#" + chart_type)
      .select("svg")
      .select("g")
      .attr("transform", "translate("+ max_labelWidth +", 0)")
      .attr("width", function() { width - max_labelWidth});
    
    //maps input values (domain) to output values (range) for this particular chart
    var x = d3.scale.linear()
      //.domain([0, d3.max("MapApp." + chart_type + "_max")])//max value for each measure: food, etiologies, locations
      .domain([0, 560])
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
      .select(".label-container");

    label_container.selectAll("text")
      .remove(); //remove and re-append below

    label_container.selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .attr("class", "data-label")
      .text(function(d) { return d; })
      .style("font-size", "11")
      .attr("x", function(d, i) { return 0 - this.getComputedTextLength(); })
      .attr("y", function(d, i) { return (i * rect_height) + rect_height/2; });
  }
});
