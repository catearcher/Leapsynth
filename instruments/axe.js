window.LSInstruments = window.LSInstruments || {};

LSInstruments.axe = {
  name: "Guitar Hero Axe",
  description: "Get shreddin'!",
  color: "danger",
  init: function(context) {
    var
    updateHand = context.updateHand,
    clearHand = context.clearHand;

    $(document).on("keydown", function(e) {

    });
  },
  destroy: function() {
    $(document).off("keydown");
  }
};