/**
 * Created by toby on 10/06/15.
 */

Template.visualisation.helpers({
  visualisation: "lineChart"
});

Template.visualisation.onRendered(function() {
  if (!this.rendered) {
    this.rendered = true;

    var grid = $('.grid-stack').data('gridstack');
    if (grid) {
      var node = this.find("#nqm-vis-card-" + this.data._id);
      grid.add_widget(node,0,0,4,2,true);
    }
  }
  if (this.data) {
    console.log("got visualisation data");
  }
});

Template.visualisation.events({
  "click .nqm-close": function(event, template) {
    Meteor.call("removeWidget", { id: template.data._id }, function(err,result) {
      if (err) {
        Materialize.toast("failed to remove visualisation: " + err.message,10000);
      } else {
        Materialize.toast("visualisation removed",4000);
        visualisationCache.remove(template.data._id);
      }
    });
  }
});

startVisualisationSubscriptions = function() {
  var cfg = this.data;
  var vis = this._visualisation;
  var self = this;

  console.log("starting subscription for: " + cfg.name);

  Session.set("ready-" + cfg._id,undefined);

  var midnight = new Date(Date.now());
  midnight.setHours(0);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);

  // Subscribe to all feed data since midnight.
  this._subscription = Meteor.subscribe("feedData", { hubId: cfg.hubId, feed: cfg.feedName, from: midnight.getTime() });

  this._watchdog = Meteor.autorun(function() {
    if (self._subscription.ready()) {
      // Build the projection based on the visualisation configuration.
      console.log("re-running data collection: " + cfg._id);

      var projection = {
        fields: {},
        sort: { "params.timestamp": 1 }
      };
      projection.fields["params." + cfg.series] = 1;
      projection.fields["params." + cfg.datum] = 1;
      cfg.collection = feeds.find({ evtName: "feedData", "key.id": cfg.feedName}, projection).fetch();

      if (Session.get("ready-" + cfg._id) === true) {
        vis.render();
        visualisationCache.add(cfg, vis);
      }
    }
  });
};

visualisationReady = function() {
  Session.set("ready-" + this.data._id,true);
};

stopVisualisationSubscriptions = function() {
  Session.set("ready-" + this.data._id,undefined);
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