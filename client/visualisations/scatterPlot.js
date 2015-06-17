/**
 * Created by toby on 16/06/15.
 */

Template.scatterPlot.onCreated(function() {
  this._visualisation = new ScatterPlot(this.data);
});

Template.scatterPlot.onRendered(function() {
  if (this.rendered) {
    console.log("******** ALREADY RENDERED");
  }

  this.rendered = true;
  startVisualisationSubscriptions.call(this);
});

Template.scatterPlot.onDestroyed(function() {
  stopVisualisationSubscriptions.call(this);
});