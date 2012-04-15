Views.Map = Backbone.Marionette.ItemView.extend({

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
    return JST['map'];
  },

  onRender: function() {
    this.foodChart = new Views.Barchart({el: "#food"});
    this.etiologyChart = new Views.Barchart({el: "#etiology"});
    this.locationChart = new Views.Barchart({el: "#location"});
    this.legend = new Views.Legend();
  },
  
  onShow: function() {
    this.drawMap();
    
    this.foodChart.drawBarChart("food", [1, 1, 1, 1, 1]); //placeholder data to initialize svg elements
    this.etiologyChart.drawBarChart("etiology", [1, 1, 1, 1, 1]);
    this.locationChart.drawBarChart("location", [1, 1, 1, 1, 1]);
   
    this.initializeSlider();
    this.colorMap(); 
  },

  initializeSlider: function() {
    $("#min, #max").datepicker({
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

  //draw inital map, no data
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

  //color filtered counties
  colorMap: function() {
    var data = this.data;
    var q_scale;
    var start_date = $("#min").datepicker("getDate");
    var end_date = $("#max").datepicker("getDate");
    var commodities = {};
    var locations = {};
    var etiologies = {};
    
    
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

      //log scale
      log_scale = d3.scale.log().domain([MapApp.outbreaks_min, MapApp.outbreaks_max]).range([0, 100]);
      
      //quantile scale
      q_scale = d3.scale.quantile().domain([log_scale(MapApp.outbreaks_min), log_scale(MapApp.outbreaks_max)]).range([1,2,3,4,5,6,7,8]);
      
      //color county
      this.counties.select("#fips_"+fips)
        .attr("class", function() { 
          if (total_adjusted_illnesses > 0) {
            return "selected q" + q_scale(log_scale(total_adjusted_illnesses)) + "-9";
          } else {
            d3.select(this).classed("selected", false);
            return "bg-path-color";
          }
        }); 
     
    }
    
    var self = this;
    this.counties.selectAll('.selected')
      .each(function(d) {
        //add mouse events to each county
        self.addInteraction(d.id, data[d.id]);
      })
   
    this.foodChart.redrawBarChart("food", commodities);
    this.etiologyChart.redrawBarChart("etiology", etiologies);
    this.locationChart.redrawBarChart("location", locations);
  },

  //add hover to filtered counties
  addInteraction: function(fips, outbreaks) {
    d3.select("body")
      .on("click", function() {
        if (d3.event.target.tagName !== "path" && d3.event.target.tagName !== "A") { //events bubble, so make sure it wasn't a path
          hideTooltip(); 
          d3.select(".selected").on("mouseover", function(d) { showTooltip(d3.event.target); });
          d3.select(".selected").on("mouseout", function(d) { hideTooltip(); });
          d3.select(".tooltip").classed("active", false);
        }
      });
    this.counties.select("#fips_"+fips)
      .on("click", function(d) {
        if (d3.select(".tooltip").classed("active") == true ) { //and event target is active path (need to add active to path)
          hideTooltip();
          d3.select(".selected").on("mouseover", function(d) { showTooltip(this); });
          d3.select(".selected").on("mouseout", function(d) { hideTooltip(); });
          d3.select(".tooltip").classed("active", false);
        } else {
          showTooltip(this);
          d3.select(".selected").on("mouseover", null);
          d3.select(this).on("mouseout", null);
          d3.select(".tooltip").classed("active", true);
        }
      })
      .on("mouseover", function(d) {
        if (d3.select(".tooltip").classed("active") == false) {
          showTooltip(this); 
        }})
      .on("mouseout", function(d) { 
        if (d3.select(".tooltip").classed("active") == false) {
          hideTooltip();
        }
      });

    function showTooltip(target) {
      d3.select(target).classed("county-hover", true);
      var height = parseInt(d3.select("#chart").style("height").replace("px", ""));
      var width = parseInt(d3.select("#chart").style("width").replace("px", ""));
      var mouse_pos = d3.mouse(target);
      var tooltip = d3.select(".tooltip"); 

      //tooltip content
      tooltip.select("ul").selectAll("li")
        .data(outbreaks)
        .enter()
        .append("li")
        .html(function(d, i){
          var first_illness = d["first_illness"] ? Date.parse(d["first_illness"]).toString("MMMM d, yyyy") : "unknown"; 
          var last_illness = d["last_illness"] ? Date.parse(d["last_illness"]).toString("MMMM d, yyyy") : "unknown";
          return "<div><p><p class='title'>Outbreak " + (i + 1) + " of " + outbreaks.length 
            + "<p><p class='date'>"+ first_illness + " - " + last_illness + "</p></p>"
            + "<p><span>Genus:</span><span>" + d["etiology_genus"] + "</span></p></p>" 
            + "<p><span>Duration:</span><span>" + d["duration"] + " day(s)" 
            + "</span></p><p><span>County:</span><span>" + d["reporting_county"] + " County"
            + "</span></p><p><span>Illnesses:</span><span>" + d["illnesses"]
            + "</span></p><p><span>Hospitalizations:</span><span>" + d["hospitapzations"]
            + "</span></p><p><span>Commodity:</span><span>" + d["commodity_group"] + "</span></p>";
        });

      //next and prev buttons
      list_items = $(".tooltip").find("li");
      $(".tooltip").find("li").hide().end().find("li:first-child").show();
      
      if (list_items.length > 1) {
        list_items.not("li:first-child").each(function(){
          if ($(this).find(".prev").length == 0) {
            $(this).append("<a class='prev'>&lt; Prev </a>");
          }});
        list_items.not("li:last-child").each(function(){
          if ($(this).find(".next").length == 0) {
            $(this).append("<a class='next'> Next &gt;</a></div>");
          }});
        
        $(".tooltip .prev").click(function(e) {
          $(e).stopPropagation;
          curr_li = $(e.currentTarget).closest("li").hide();
          curr_li.prev().show();
        }); 
        $(".tooltip .next").click(function(e) {
          $(e).stopPropagation;
          curr_li = $(e.currentTarget).closest("li").hide();
          curr_li.next().show();
        }); 
      }
     
      //tooltip position
      tooltip.style("left", function() {
          var tooltip_width = tooltip.style("width").replace("px", "");
          if ((width - tooltip_width) <= mouse_pos[0]) { 
            return ((mouse_pos[0] - tooltip_width) + "px");
          } else {
            return mouse_pos[0] + "px";
          }
        })
        .style("top", function() {
          var tooltip_height = tooltip.style("height").replace("px", "");
          if (height - tooltip_height <= mouse_pos[1]) {
            return ((height - tooltip_height - 25) + "px");
          } else {
            return mouse_pos[1] + "px";
          }
        })
        .style("visibility", "visible");
    
    }


    function hideTooltip() {
      d3.select("#chart svg g").selectAll("path").classed("county-hover", false);
      d3.select(".tooltip")
        .style("visibility", "hidden")
        .selectAll("li")
        .remove();
    }
  }

});
