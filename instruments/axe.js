window.LSInstruments = window.LSInstruments || {};

LSInstruments.axe = {
  name: "Guitar Hero Axe",
  description: "Get shreddin'!",
  color: "danger",
  init: function(context) {
    var
    updateHand = context.updateHand,
    clearHand = context.clearHand,
    keyFrequencyMap = {
      65: 55.00,
      83: 61.74,
      68: 65.41,
      70: 73.42,
      71: 82.41
    };

    updateHand("left", {
      amplitude: 1
    });

    $(document).on({
      keydown: function(e) {
        if (_.contains(_.keys(keyFrequencyMap), e.which+"")) {
          updateHand("right", {
            frequency: keyFrequencyMap[e.which]
          });
        }

        $(document).trigger("handsChange");
      },
      keyup: function(e) {
        clearHand("right");
        $(document).trigger("handsChange");
      }
    });
  },
  destroy: function() {
    $(document).off("keydown");
  }
};