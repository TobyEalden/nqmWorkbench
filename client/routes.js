/**
 * Created by toby on 10/06/15.
 */

var homeRoute =  {
  template: "home",
  layoutTemplate: "homeLayout",
  loadingTemplate: "loadingTemplate"
  //waitOn: function() {
  //  return Meteor.subscribe("vis");
  //},
  //data: function() {
  //  return {
  //    visualisations: visualisations.find().fetch()
  //  }
  //}
};

Router.route("/", homeRoute);
Router.route("/visualise", homeRoute);

Router.route("/feeds", {
  template: "feeds",
  layoutTemplate: "homeLayout",
  loadingTemplate: "loadingTemplate",
});

Router.route("/widgetDetails", {
  template: "widgetDetails",
  layoutTemplate: "homeLayout",
  loadingTemplate: "loadingTemplate",
  waitOn: function() {
    return [Meteor.subscribe("widgetTypes"), Meteor.subscribe("feedName")];
  },
  data: function() {
    return {
      widgetType: widgetTypes.find(),
      feedName: feeds.find({ evtName: "created"})
    }
  }
});