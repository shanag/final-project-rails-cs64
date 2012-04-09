MapRouter = Backbone.Router.extend({
  routes: {
    "": "index"
  },

  index: function() {
    var header = new Views.Header();
    MapApp.headerRegion.show(header);
    
    d3.json('/api/outbreaks', function(response) {
      var visualization = new Views.Visualization({data: response});
      MapApp.mainRegion.show(visualization);
    });
  }
});
