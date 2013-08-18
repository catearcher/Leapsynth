var LS = (function() {
  var
  __isLeapEnabled = true,
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
  handleHand = function(which, data) {
    var $handPosition, $fingers;

    if (which === "left") {
      $handPosition = $("#left-hand-position");
      $fingers = $("#left-hand-fingers");
    } else {
      $handPosition = $("#right-hand-position");
      $fingers = $("#right-hand-fingers");
    }

    if (data === "clear") {
      $handPosition.empty();
      $fingers.empty()
    } else {
      $handPosition.html(_.map(data.stabilizedPalmPosition, function(pos) {
        return Math.round(pos);
      }).join(" / "));

      $fingers.html(data.fingers.length);
    }

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
              handleHand("left", hands[0]);
              handleHand("right", "clear");
            } else {
              handleHand("left", "clear");
              handleHand("right", hands[0]);
            }
          } else if (hands.length > 1) {
            handleHand("left", hands[0]);
            handleHand("right", hands[1]);
          }
        } else {
          handleHand("left", "clear");
          handleHand("right", "clear");
        }
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