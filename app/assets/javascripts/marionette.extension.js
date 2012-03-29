var ItemViewExtensions = {
  serializeData: function() {
    var data = {};
    if (this.collection) {
      data.items = this.collection.toJSON();
    }
    if (this.model) { data = this.model.toJSON(); }

    return _.extend(data, this.data);
  }
};

var CollectionViewExtensions = {
    render: function(){
      var that = this;
      this.getTemplate(function(template){
        var html = that.renderTemplate(template);
        that.$el.html(html);
      });

      this.renderModel();

      this.collection.each(this.addChildView);
      if (this.onRender){
        this.onRender();
      }
      return this;
    }
};

var ViewExtensions = {
  renderTemplate: function(template, data){
    if (!template || template.length === 0){
      var err = new Error("A template must be specified");
      err.name = "NoTemplateError";
      throw err;
    }

    return template(data);
  },

   getTemplate: function(callback){
    var template = this.template;

    if (_.isFunction(template)){
      var templateData = template.call(this);
      callback.call(this, templateData);
    } else {
      //Backbone.Marionette.TemplateManager.get(template, callback);
      return null;
    }
  },
  
  addChild: function(view){
    view.render();
    this.storeChild(view);
  },
  storeChild: function(view){
    if (!this.children){
      this.children = {};
    }
    this.children[view.cid] = view;
  },
  close: function(){
    this.unbind();
    this.unbindAll();
    this.remove();

    if (this.children){
      _.each(this.children, function(childView){
        childView.close();
      });
    }

    if (this.onClose){
      this.onClose();
    }
  }
}

var RegionManagerExtensions = {
  show: function(view){
    this.ensureEl();
    this.close();
    this.open(view);
    this.currentViews = [];
    this.currentViews.push(view);
  },
  append: function(view) {
    this.open(view);

    this.currentViews.push(view);
  },

  prepend: function(view) {
    this.open(view, 'prepend');
    this.currentViews.push(view);
  },

  open: function(view, appendMethod){
    var that = this;

    appendMethod = appendMethod || 'append';

    $.when(view.render()).then(function () {
      that.$el[appendMethod](view.el);
      view.onShow && view.onShow();
      that.trigger("view:show", view);
    });

  },

  close: function(){
    var views = this.currentViews;
    if (!views){ return; }

    _.each(views, function(view) {
      view.close && view.close();
      this.trigger("view:closed", view);
    }, this);

    delete this.currentViews;
  }
}

_.extend(Backbone.Marionette.CollectionView.prototype, CollectionViewExtensions, ViewExtensions);
_.extend(Backbone.Marionette.ItemView.prototype, ItemViewExtensions, ViewExtensions);
_.extend(Backbone.Marionette.RegionManager.prototype, RegionManagerExtensions);
