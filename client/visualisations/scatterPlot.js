/**
 * Created by toby on 16/06/15.
 */

Template.scatterPlot.onCreated(function() {
  this._visualisation = new ScatterPlot(this.data);
  startVisualisationSubscriptions.call(this);
});

Template.scatterPlot.onRendered(function() {
  visualisationReady.call(this);
});

Template.scatterPlot.onDestroyed(function() {
  stopVisualisationSubscriptions.call(this);
});