/**
 * Created by toby on 16/06/15.
 */

Template.lineChart.onCreated(function() {
  this._visualisation = new LineChart(this.data);
  startVisualisationSubscriptions.call(this);
});

Template.lineChart.onRendered(function() {
  visualisationReady.call(this);
});

Template.lineChart.onDestroyed(function() {
  stopVisualisationSubscriptions.call(this);
});

