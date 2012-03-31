MapRouter = Backbone.Router.extend({
  routes: {
    "": "index"
  },

  index: function() {
    var header = new Views.Header();
    MapApp.headerRegion.show(header);

    var visualization = new Views.Visualization();
    MapApp.mainRegion.show(visualization);
  }
});
