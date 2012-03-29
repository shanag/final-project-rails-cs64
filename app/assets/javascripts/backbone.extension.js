// Let's make these viewOptions open for extension
var BackboneViewExtension = {
  viewOptions: ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'data'],

  _configure: function(options) {
    if (this.options) options = _.extend({}, this.options, options);
    for (var i = 0, l = this.viewOptions.length; i < l; i++) {
      var attr = this.viewOptions[i];
      if (options[attr]) this[attr] = options[attr];
    }
    this.options = options;
  }
};

_.extend(Backbone.View.prototype, BackboneViewExtension);
