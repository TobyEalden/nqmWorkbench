/**
 * Created by toby on 14/06/15.
 */

Meteor.methods({
  addWidget: function(widget) {
    var widgetType = widgetTypes.findOne({ name: widget.type});
    if (widgetType) {
      console.log("adding widget of type: " + widget.type)
      var newWidget = visualisations.insert(widget);
      return newWidget._id;
    } else {
      console.log("unknown widget type: " + widget.type);
      throw new Error("unknown widget type: " + widget.type);
    }
  },
  removeWidget: function(widget) {
    return visualisations.remove({_id: widget.id});
  }
});
