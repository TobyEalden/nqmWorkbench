/**
 * Created by toby on 10/06/15.
 */

Template.home.rendered = function() {
  if (!this.rendered) {
    this.rendered = true;
    console.log("home template rendered " + this.view.renderCount + " times");
    $('.tooltipped').tooltip({ delay: 50 });
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