Meteor.startup(function() {
  if (visualisations.find().count() === 0) {
    visualisations.insert({
      type: "lineChart",
      name: "Humidity",
      container: "#humidityScatter",
      containerWidth: 600,
      containerHeight: 500,
      margins: {top: 20, right: 20, bottom: 30, left: 50},
      hubId: "RPi-001",
      feedName: "office-temp/humid-001",
      series: "timestamp",
      datum: "humidity"
    });
    visualisations.insert({
      type: "lineChart",
      name: "Temperature",
      container: "#tempScatter",
      containerWidth: 600,
      containerHeight: 500,
      margins: {top: 20, right: 20, bottom: 30, left: 50},
      hubId: "RPi-001",
      feedName: "office-temp/humid-001",
      series: "timestamp",
      datum: "temperature"
    });
    visualisations.insert({
      type: "scatterPlot",
      name: "Power",
      container: "#powerScatter",
      containerWidth: 600,
      containerHeight: 500,
      margins: {top: 20, right: 20, bottom: 30, left: 50},
      hubId: "RPi-001",
      feedName: "office-power",
      series: "timestamp",
      datum: "power"
    });
  }
  Meteor.publish("vis", function() {
    return visualisations.find();
  });
  Meteor.publish("feedName", function(opts) {
    return feeds.find({ evtName: "created" });
  });
  Meteor.publish("feedData", function(opts) {
    var lookup = {
      evtName: "feedData",
      key: { hubId: opts.hubId, id: opts.feed }
    };
    if (opts.from) {
      lookup["params.timestamp"] = { $gt: opts.from };
    }
    opts.limit = opts.limit || 1000;

    return feeds.find(lookup,{ sort: { "params.timestamp": -1 }, limit: opts.limit });
  });
  Meteor.publish("widgetTypes", function() {
    return widgetTypes.find();
  })
});
