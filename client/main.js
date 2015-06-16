/**
 * Created by toby on 14/06/15.
 */

observers = {};

var themes = {
  "blue-grey": {
    mainColour: "blue-grey z-depth-3",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-3",
    visualisationTitle: "white-text text-lighten-2",
    background: "blue-grey darken-2 grey-text text-lighten-5"
  },
  "indigo": {
    mainColour: "indigo  z-depth-3",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-2",
    background: "white grey-text text-lighten-5"
  },
  "teal": {
    mainColour: "teal darken-2 z-depth-3",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-1",
    visualisationTitle: "teal-text text-darken-4",
    background: "grey darken-4 grey-text text-lighten-5"
  },
  "amber": {
    mainColour: "amber darken-1 z-depth-2",
    menuTextColour: "black-text text-lighten-2",
    mainTextColour: "deep-orange-text text-darken-4",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-1",
    background: "grey darken-2 grey-text text-lighten-5"
  },
  "grey": {
    mainColour: "grey darken-1 z-depth-2",
    menuTextColour: "grey-text text-lighten-2",
    mainTextColour: "black-text text-darken-4",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-1",
    visualisationTitle: "orange-text",
    background: "grey darken-2 grey-text text-lighten-5"
  }
};

Template.registerHelper("theme", function() {
  return themes[Session.get("theme") || "blue-grey"];
});

Meteor.startup(function() {
  Tracker.autorun(function() {
    $("body").removeClass();
    $("body").addClass(themes[Session.get("theme") || "blue-grey"].background);
  });

  Meteor.subscribe("widgetTypes");
});