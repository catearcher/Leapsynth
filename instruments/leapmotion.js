window.LSInstruments = window.LSInstruments || {};

LSInstruments.leapmotion = {
  name: "Leap Motion",
  description: "Play LeapSynth the way it was meant to be played: With a Leap Motion Controller.",
  color: "success",
  init: function(context) {
    var
    leapController = new Leap.Controller({enableGestures: false}),
    updateHand = context.updateHand,
    clearHand = context.clearHand,
    handsHandler = context.handsHandler;

    leapController.on("frame", function(frame) {
    var hands = frame.hands;

    if (hands.length) {
      hands = _.sortBy(hands, function(hand) {
        return hand.palmPosition[0];
      });

      if (hands.length === 1) {
        if (hands[0].stabilizedPalmPosition[0] < 0) {
          updateHand("left", hands[0]);
          clearHand("right");
        } else {
          clearHand("left");
          updateHand("right", hands[0]);
        }
      } else if (hands.length > 1) {
        updateHand("left", hands[0]);
        updateHand("right", hands[1]);
      }
    } else {
      clearHand("left");
      clearHand("right");
    }

    $(document).trigger("handsChange");
  });

    leapController.connect();
  }
};