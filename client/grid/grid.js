/**
 * Created by toby on 10/06/15.
 */

Template.grid.helpers({
  gridItem: function() {
    return Session.get("gridStackItems"); //Template.instance()._gridItems;
  }
});

Template.grid.rendered = function() {
  var self = this;

  if (!this.rendered) {
    this.rendered = true;

    var options = {
      auto: true,
      float: false,
      cell_height: 80,
      vertical_margin: 20,
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      always_show_resize_handle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    $(".grid-stack").gridstack(options);
    $(".grid-stack").on("change", function(e,items) {
      //var updates = [];
      //_.each(items, function(item) {
      //  var data = item.el.data();
      //  var gridItem = _.find(self._gridItems,function(item) { return item._id === data.visId; });
      //  var update = {
      //    _id: data.visId,
      //    position: {
      //      x: item.x,
      //      y: item.y,
      //      w: item.width,
      //      h: item.height
      //    }
      //  };
      //  Meteor.call("updateWidgetPosition",update);
      //  //Session.set("gridStackItems",self._gridItems);
      //});
      visualisationCache.update(items);
    });

    //visualisationCache.update();

    this._subscription = Meteor.subscribe("vis");
    this._tracker = Tracker.autorun(function() {
      if (self._subscription.ready()) {
        self._gridItems = [];

        self._cursor = visualisations.find();
        self._cursor.observe({
          added: function(v) {
            self._gridItems.push(v);
            Session.set("gridStackItems",self._gridItems);
          },
          changedAt: function(vnew, vold, idx) {
            var existing = self._gridItems[idx];
            if (!existing.positon || existing.position.x !== vnew.position.x || existing.position.y !== vnew.position.y || existing.position.w !== vnew.position.w || existing.position.h !== vnew.position.h) {
              console.log("updated item: " + vnew._id + ", position: " + JSON.stringify(vnew));

              self._gridItems[idx] = vnew;
              Session.set("gridStackItems",self._gridItems);

              var visualInfo = visualisationCache.find(vnew._id);
              Meteor.setTimeout(function() {
                visualInfo.visualisation._visualisation.checkSize();
              },50);

              var grid = $('.grid-stack').data('gridstack');
              if (grid) {
                grid.update(visualInfo.nodeElement, vnew.position.x, vnew.position.y, vnew.position.w, vnew.position.h);
              }
            }
          },
          removedAt: function(v, idx) {
            self._gridItems.splice(idx,1);
            Session.set("gridStackItems",self._gridItems);
          }
        });

        // Once observe has finished we should have the initial set of documents.

      }
    });
  }
};