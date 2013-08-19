window.LSInstruments = window.LSInstruments || {};

LSInstruments.mouse = {
  name: "Mouse",
  description: "Move your mouse across the page to make sweet sweet sounds.",
  color: "info",
  init: function(context) {
    var
    updateHand = context.updateHand,
    clearHand = context.clearHand;

    $(document).on("mousemove", function(e) {
      updateHand("left", {
        position: [-30, e.screenX, 0],
        fingers: e.ctrlKey ? 0 : 5
      });

      updateHand("right", {
        position: [30, e.screenY, 0],
        fingers: e.altKey ? 0 : 5
      });


      $(document).trigger("handsChange");
    });
  },
  destroy: function() {
    $(document).off("mousemove");
  }
};