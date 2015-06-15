/**
 * Created by toby on 15/06/15.
 */

SeriesBase = (function() {
  var updateDelayTimeout = 50;

  // Constructor
  function SeriesBase(cfg) {
    this._svgElement = null;
    this._dataGroup = null;
    this._renderGroup = null;
    this._config = cfg;
    this._xAxis = null;
    this._yAxis = null;
    this._xScale = null;
    this._yScale = null;
    this._timeout = 0;
    this._width = 0;
    this._height = 0;
    this._margins = {
      top: 5,
      right: 5,
      bottom: 30,
      left: 50
    };
  }

  SeriesBase.prototype.render = function() {
    if (!this._svgElement) {
      initialise.call(this);
    }

    throttledRender.call(this);
  };

  var initialise = function() {
    var self = this;

    // Create SVG container.
    this._svgElement = d3.select("#" + this._config.type + "-" + this._config._id);

    this._xValue = function (d) { return d.params[self._config.series] };
    this._xMap = function (d) { return self._xScale(self._xValue(d)); };

    this._yValue = function (d) { return parseFloat(d.params[self._config.datum]); };
    this._yMap = function (d) { return self._yScale(self._yValue(d)); };

    this._colour = d3.scale.category20b();

    this._svgElement.selectAll(".nqm-visualisationGroup").data([0]).enter()
      .append("g")
      .attr("class", "nqm-visualisationGroup")
      .attr("transform", "translate(" + this._margins.left + "," + this._margins.top + ")");

    this._dataGroup = this._svgElement.select(".nqm-visualisationGroup");

    // x axis.
    this._dataGroup.append("g")
      .attr("id", "nqm-vis-x-axis-" + this._config._id)
      .attr("class", "x axis");

    // y axis.
    this._dataGroup.append("g")
      .attr("id", "nqm-vis-y-axis-" + this._config._id)
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(this._config.datum);

    this._renderGroup = this._dataGroup.append("g");

    this.onInitialise();

    this.checkSize();

    d3.select("#nqm-vis-loading-" + this._config._id).remove();
    this._svgElement.classed("nqm-not-visible", false);
  };

  // Placeholders for derived class methods.
  SeriesBase.prototype.onInitialise = function() {};
  SeriesBase.prototype.onRender = function() {};

  // A helper function to throttle rendering updates. So if many updates are received
  // in a short period of time the changes will only be rendered when the last update is received.
  var throttledRender = function() {
    if (this._timeout !== 0) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(scaleAndRender.bind(this), updateDelayTimeout);
  };

  // Helper function to perform an animated transition of the bound data.
  // Call this every time some data changes.
  var scaleAndRender = function() {
    console.log(this._config.type + " rendering");
    var self = this;

    if (this._config.collection) {
      // Set the axis domain range.
      this._xScale.domain(d3.extent(this._config.collection, this._xValue));

      var dataDomain = d3.extent(this._config.collection, this._yValue);
      this._yScale.domain(dataDomain);
      this._colour.domain(dataDomain);

      this._dataGroup.select(".x.axis")
        .transition()
        .duration(1000)
        .call(this._xAxis);

      this._dataGroup.select(".y.axis")
        .transition()
        .duration(1000)
        .call(this._yAxis);

      this.onRender(this._renderGroup);
    }

    this._timeout = 0;
  };

  SeriesBase.prototype.checkSize = function() {
    // Get parent card.
    var card = d3.select("#nqm-vis-card-" + this._config._id);
    // Get parent card content.
    var cardContent = d3.select("#nqm-vis-content-" + this._config._id);
    // Get title.
    var title = d3.select("#nqm-vis-title-" + this._config._id);

    // Determine dimensions of parent node.
    var width = card.node().offsetWidth;
    var height = card.node().offsetHeight;

    // Adjust height, taking into account title bar.
    height -= title.node().offsetHeight;

    if (width !== this._width || height !== this._height) {
      // Set dimensions on card content.
      cardContent.attr("width", width).attr("height", height);

      // Set dimensions on svg element.
      this._svgElement.attr("width", width).attr("height", height);

      // For svg content, adjust dimensions for margins.
      this._width = width;
      this._height = height;
      width = this._width - this._margins.left - this._margins.right;
      height = this._height - this._margins.top - this._margins.bottom;

      this._xScale = d3.time.scale().range([0, width]);
      this._xAxis = d3.svg.axis().scale(this._xScale).orient("bottom").ticks(5);

      this._yScale = d3.scale.linear().range([height, 0]);
      this._yAxis = d3.svg.axis().scale(this._yScale).orient("left");

      d3.select("#nqm-vis-x-axis-" + this._config._id)
        .attr("transform", "translate(" + 0 + "," + height + ")");

      throttledRender.call(this);
    }
  };

  SeriesBase.prototype.startObserver = function() {
    var self = this;
    var cfg = this._config;

    var midnight = new Date(Date.now());
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);

    // Subscribe to all feed data since midnight.
    self._subscription = Meteor.subscribe("feedData", { hubId: cfg.hubId, feed: cfg.feedName, from: midnight.getTime() }, function() {
      if (self._watchdog) {
        self._watchdog.stop();
      }
      self._watchdog = Meteor.autorun(function() {
        // Build the projection based on the visualisation configuration.
        var projection = {
          fields: {},
          sort: { "params.timestamp": 1 }
        };
        projection.fields["params." + cfg.series] = 1;
        projection.fields["params." + cfg.datum] = 1;
        cfg.collection = feeds.find({ evtName: "feedData", "key.id": cfg.feedName}, projection).fetch();

        if (Session.get("ready-" + cfg._id) === true) {
          self.render();
          visualisationCache.add(cfg, self);
        }
      });
    });
  };

  SeriesBase.prototype.destroy = function() {
    if (this._subscription) {
      this._subscription.stop();
    }
    if (this._watchdog) {
      this._watchdog.stop();
    }
  };

  return SeriesBase;
}());
