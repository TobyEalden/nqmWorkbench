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