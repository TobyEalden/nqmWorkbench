/**
 * Created by toby on 16/06/15.
 */

Template.lineChart.onCreated(function() {
  this._visualisation = new LineChart(this.data);
});

Template.lineChart.onRendered(function() {
  startVisualisationSubscriptions.call(this);
});

Template.lineChart.onDestroyed(function() {
  stopVisualisationSubscriptions.call(this);
});

