/**
 * Created by toby on 10/06/15.
 */

Template.home.rendered = function() {
  if (!this.rendered) {
    this.rendered = true;
    console.log("home template rendered " + this.view.renderCount + " times");

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

    $('.tooltipped').tooltip({ delay: 50 });

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: -95, // Spacing from edge
        belowOrigin: true // Displays dropdown below the button
      }
    );

    visualisationCache.update();
  }
};

Template.home.events({
  "click #nqm-theme-change-btn": function(event, template) {
    var themes = Object.keys(Session.get("themes"));
    var current = themes.indexOf(Session.get("theme"));
    current++;
    if (current == themes.length) {
      current = 0;
    }
    Session.set("theme",themes[current]);
    Materialize.toast(themes[current],2000);
  }
});