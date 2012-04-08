var
  Models = {},
  Collections = {},
  Views = {};

MapApp = new Backbone.Marionette.Application();

MapApp.addInitializer(function(options) {
  // initialize collections
  this.outbreaks_min = options.outbreaks_min;
  this.outbreaks_max = options.outbreaks_max;
  this.outbreaks = new Collections.Outbreaks(options.outbreaks);
  this.counties = options.counties;
  this.states = options.states;

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
