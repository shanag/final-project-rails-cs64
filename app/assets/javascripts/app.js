var
  Models = {},
  Collections = {},
  Views = {};

MapApp = new Backbone.Marionette.Application();

MapApp.addInitializer(function(options) {
  // initialize collections
  this.outbreaks = new Collections.Outbreaks(options.outbreaks);

  // ajax setup
  $.ajaxSetup({
    headers: { HTTP_ACCEPT: 'application/vnd.map-v1+json' }
  });

  // region managers
  var HeaderRegion = Backbone.Marionette.RegionManager.extend({
    el: "#header"
  });

  var MainRegion = Backbone.Marionette.RegionManager.extend({
    el: "#main"
  });

  var FooterRegion = Backbone.Marionette.RegionManager.extend({
    el: "#footer"
  });


  this.addRegions({
    headerRegion: HeaderRegion,
    mainRegion: MainRegion,
    footerRegion: FooterRegion
  });

  this.router = new MapRouter();
  Backbone.history.start();
});

ActiveAjaxRequests = false;
$(document)
  .ajaxSend(function(){ ActiveAjaxRequests = true;  })
  .ajaxStop(function(){ ActiveAjaxRequests = false; });

google.load('visualization', '1.0', {'packages':['corechart']});
