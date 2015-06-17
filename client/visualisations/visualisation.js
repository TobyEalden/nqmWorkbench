/**
 * Created by toby on 10/06/15.
 */

Template.visualisation.events({
  "click .nqm-close": function(event, template) {
    Meteor.call("removeWidget", template.data._id, function(err,result) {
      if (err) {
        Materialize.toast("failed to remove visualisation: " + err.message,10000);
      } else {
        Materialize.toast("visualisation removed",4000);
        visualisationCache.remove(template.data._id);
      }
    });
  }
});

Template.gridContent.onCreated(function() {
  console.log("******* creating visualisatoin");
});

//Template.gridContent.onRendered(function() {
//  if (!this.rendered) {
//    this.rendered = true;
//
//    var grid = $('.grid-stack').data('gridstack');
//    if (grid) {
//      var node = this.find("#nqm-vis-card-" + this.data._id);
//      grid.add_widget(node,0,0,4,2,true);
//    }
//  }
//  if (this.data) {
//    console.log("got visualisation data");
//  }
//});

var doVisualisationRender = function() {
  var cfg = this.data;
  var vis = this._visualisation;

  // Make sure loading screen is gone.
  $("#nqm-vis-loading-" + cfg._id).remove();

  if (cfg.collection.length > 0) {
    // Display SVG if we have data.
    // Need to use attr here as removeClass doesn't work on SVG.
    $("#" + cfg.type + "-" + cfg._id).attr("class","nqm-svg");
  } else {
    // Display 'no data' if there's none.
    $("#nqm-vis-no-data-" + cfg._id).removeClass("nqm-not-visible");
  }
  vis.render();
};

startVisualisationSubscriptions = function() {
  var cfg = this.data;
  var vis = this._visualisation;
  var self = this;

  if (this._subscription) {
    console.log("***************** already subscribed");
  }

  console.log("starting subscription for: " + cfg.name);

  cfg.collection = [];

  // Subscribe to data for last 24 hours.
  var sinceDate = new Date(Date.now() - 24*60*60*1000);
  this._subscription = Meteor.subscribe("feedData", { hubId: cfg.hubId, feed: cfg.feedName, from: sinceDate.getTime() });

  this._watchdog = Tracker.autorun(function() {
    if (self._subscription.ready()) {
      // Debug timing.
      var timer = Date.now();
      console.log(cfg.feedName + " starting find: " + (Date.now() - timer));

      // Build the projection based on the visualisation configuration.
      var projection = {
        fields: {},
        sort: { "params.timestamp": 1 }
      };
      projection.fields["params." + cfg.series] = 1;
      projection.fields["params." + cfg.datum] = 1;

      var cursor = feeds.find({ evtName: "feedData", "key.id": cfg.feedName}, projection);
      console.log(cfg.feedName + " finished find: " + (Date.now() - timer));

      cursor.observe({
        added: function(d) {
          cfg.collection.push(d);
          doVisualisationRender.call(self);
        },
        removedAt: function(d,i) {
          console.log("removing at: " + i);
          cfg.collection.splice(i,1);
          doVisualisationRender.call(self);
        }
      });

      console.log(cfg.feedName + " data loaded: " + (Date.now() - timer));
      doVisualisationRender.call(self);
      self.visualisationPositionChanged = visualisationPositionChanged;
      visualisationCache.add(cfg, self, $("#nqm-vis-" + cfg._id).get(0));
    }
  });
};

stopVisualisationSubscriptions = function() {
  if (this._watchdog) {
    this._watchdog.stop();
    delete this._watchdog;
  }
  if (this._subscription) {
    this._subscription.stop();
    delete this._subscription;
  }
  visualisationCache.remove(this.data._id);
};

visualisationPositionChanged = function(x,y,w,h) {
  this._visualisation.checkSize();
  var update = {
    _id: this.data._id,
    position: {
      x: x,
      y: y,
      w: w,
      h: h
    }
  };
  Meteor.call("updateWidgetPosition",update);
};