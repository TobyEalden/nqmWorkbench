/**
 * Created by toby on 10/06/15.
 */

Template.grid.rendered = function() {
  if (!this.rendered) {
    this.rendered = true;

    var options = {
      auto: true,
      float: false,
      cell_height: 80,
      vertical_margin: 20,
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      always_show_resize_handle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    $(".grid-stack").gridstack(options);
    $(".grid-stack").on("change", function(e,items) {
      visualisationCache.update(items);
    });

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: -95, // Spacing from edge
        belowOrigin: true // Displays dropdown below the button
      }
    );

    //visualisationCache.update();

  }
};