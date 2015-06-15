/**
 * Created by toby on 11/06/15.
 */

visualisationCache = (function() {
  var cache = {};

  var add = function(cfg, vis, el) {
    cache[cfg._id] = {
      cfg: cfg,
      visualisation: vis,
      nodeElement: el
    }
  };

  var remove = function(id) {
    delete cache[id];
  };

  var find = function(lookup) {
    var it;

    if (typeof lookup === "string") {
      it = cache[lookup];
    } else {
      for (var c in cache) {
        if (cache.hasOwnProperty(c)) {
          if (cache[c].nodeElement === lookup) {
            it = cache[c];
            break;
          }
        }
      }

    }

    return it;
  };

  var update = function(items) {
    if (false && items) {
      for (var i = 0, len = items.length; i < len; i++) {
        var visInfo = find(items[i].el.get(0));
        if (visInfo) {
          visInfo.visualisation.checkSize();
        }
      }
    } else {
      for (var c in cache) {
        if (cache.hasOwnProperty(c)) {
          cache[c].visualisation.checkSize();
        }
      }
    }
  };

  return {
    add: add,
    remove: remove,
    find: find,
    update: update
  }
}());