/**
 * Created by toby on 14/06/15.
 */

observers = {};

Meteor.startup(function() {
  Meteor.subscribe("widgetTypes");
});