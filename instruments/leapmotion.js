window.LSInstruments = window.LSInstruments || {};

(function() {
  var leapController;

  LSInstruments.leapmotion = {
    name: "Leap Motion",
    description: "Play LeapSynth the way it was meant to be played: With a Leap Motion Controller. For most synthesizers, your left hand controls the amplitude and your right hand the frequency of the sound.",
    color: "success",
    init: function(context) {
      var
      updateHand = context.updateHand,
      clearHand = context.clearHand;

      window.lc = leapController = new Leap.Controller({enableGestures: false});

      leapController.on("frame", function(frame) {
        var hands = [];

        if (frame.hands.length) {
          frame.hands = _.sortBy(frame.hands, function(hand) {
            return hand.stabilizedPalmPosition[0];
          });

          _.each(frame.hands, function(hand) {
            hands.push({
              position: _.map(hand.stabilizedPalmPosition, function(pos) {
                return Math.round(pos);
              }),
              fingers: hand.fingers.length
            });
          });

          if (hands.length === 1) {
            if (hands[0].position[0] < 0) {
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
    },
    destroy: function() {
      leapController.disconnect();
      leapController._events.frame = null; // nötiger Hack wegen auto-reconnect
    }
  };
}());