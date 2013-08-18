var LS = (function() {
  var
  __isLeapEnabled = true,
  __hands = {
    left: null,
    right: null
  },
  enableLeap = function() {
    __isLeapEnabled = true;
  },
  disableLeap = function() {
    __isLeapEnabled = false;
  },
  attachDomHandlers = function() {
    $(".button-enable-leap").on("click", function() {
      enableLeap();
    });

    $(".button-disable-leap").on("click", function() {
      disableLeap();
    });
  },
  clearHand = function(which) {
    __hands[which] = null;
  },
  updateHand = function(which, data) {
    if (data === "clear") {
      clearHand(which);
      return;
    }

    __hands[which] = {
      position: _.map(data.stabilizedPalmPosition, function(pos) {
        return Math.round(pos);
      }).join(" / "),
      fingers: data.fingers.length
    };
  },
  handleHands = function() {
    var $handPosition, $fingers, hand;

    _.each(["left", "right"], function(which) {
      hand = __hands[which];

      $handPosition = $("#" + which + "-hand-position");
      $fingers = $("#" + which + "-hand-fingers");

      if (hand) {
        $handPosition.html(hand.position);
        $fingers.html(hand.fingers)
      } else {
        $handPosition.empty();
        $fingers.empty();
      }
    });
  },
  init = function() {
    attachDomHandlers();

    Leap.loop({enableGestures: true}, function(frame) {
      var hands = frame.hands;

      if (__isLeapEnabled) {
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

        handleHands();
      }
    });
  };


  init();

  return {
    init: init,
    enableLeap: enableLeap,
    disableLeap: disableLeap
  };
}());