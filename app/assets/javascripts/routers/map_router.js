MapRouter = Backbone.Router.extend({
  routes: {
    "": "index"
  },

  index: function() {
    var header = new Views.Header();
    MapApp.headerRegion.show(header);
    
    d3.json('/api/outbreaks', function(response) {
      var map = new Views.Map({data: response});
      MapApp.mainRegion.show(map);
    });
  }
});
