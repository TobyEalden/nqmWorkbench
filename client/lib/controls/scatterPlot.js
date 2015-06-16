/**
 * Created by toby on 10/06/15.
 */

window.ScatterPlot = (function() {
  // Constructor
  function ScatterPlot(cfg) {
    SeriesBase.call(this, cfg);
  }

  ScatterPlot.prototype = Object.create(SeriesBase.prototype);
  ScatterPlot.prototype.constructor = ScatterPlot;

  ScatterPlot.prototype.onRender = function(renderGroup) {
    console.log("scatterPlot rendering");

    var self = this;
    var updateSelection = renderGroup.selectAll("circle").data(this._config.collection, this._xValue);

    updateSelection
      .enter()
      .append("circle")
      .attr("r",1)
      .attr("fill",function(d) { return self._colour(d.params[self._config.datum]); });

    updateSelection
      .transition()
      .duration(1000)
      .attr("cx", self._xMap)
      .attr("cy", self._yMap);

    updateSelection
      .exit()
      .remove();
  };

  return ScatterPlot;
}());
