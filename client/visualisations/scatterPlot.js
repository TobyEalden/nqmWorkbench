/**
 * Created by toby on 10/06/15.
 */

var ScatterPlot = (function() {
  // Constructor
  function ScatterPlot(cfg) {
    SeriesBase.call(this, cfg);
  }

  ScatterPlot.prototype = Object.create(SeriesBase.prototype);
  ScatterPlot.prototype.constructor = ScatterPlot;

  ScatterPlot.prototype.onRender = function(renderGroup) {
    var self = this;

    var timer = Date.now();
    console.log("starting");
    var updateSelection = renderGroup.selectAll("circle").data(this._config.collection); //, function(d) { return d.params[self._config.series]});

    console.log("starting enter selection: " + (Date.now() - timer));
    updateSelection
      .enter()
      .append("circle")
      .attr("r",2)
      .attr("fill",function(d) { return self._colour(d.params[self._config.datum]); });

    console.log("starting update selection: " + (Date.now() - timer));
    updateSelection
      .transition()
      .duration(1000)
      .attr("cx", self._xMap)
      .attr("cy", self._yMap);

    console.log("starting exit selection: " + (Date.now() - timer));
    updateSelection
      .exit()
      .remove();

    console.log("finished: " + (Date.now() - timer));
  };

  return ScatterPlot;
}());

Template.scatterPlot.onCreated(function() {
  Session.set("ready-" + this.data._id,undefined);
  this.visualisation = new ScatterPlot(this.data);
  this.visualisation.startObserver();
});

Template.scatterPlot.onRendered(function() {
  if (!this.rendered) {
    this.rendered = true;
    Session.set("ready-" + this.data._id,true);
  }
});

Template.scatterPlot.onDestroyed(function() {
  this.visualisation.destroy();
});