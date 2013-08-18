var LS = (function() {
  var
  __isLeapEnabled = true,
  __hands = {
    left: null,
    right: null
  },
  __audio = {
    init: function(context) {
      __audio.context = context;

      __audio.vco = context.createOscillator();
      __audio.lfo = context.createOscillator();
      __audio.lfoGain = context.createGain();
      __audio.vcf = context.createBiquadFilter();
      __audio.output = context.createGain();

      __audio.vco.connect(__audio.vcf);
      __audio.vcf.connect(__audio.output);
      __audio.lfo.connect(__audio.lfoGain);
      __audio.lfoGain.connect(__audio.vcf.frequency);

      __audio.output.gain.value = 0;
      __audio.vco.type = __audio.vco.SAWTOOTH;
      __audio.lfo.type = __audio.lfo.SAWTOOTH;
      __audio.vco.start(__audio.context.currentTime);
      __audio.lfo.start(__audio.context.currentTime);

      __audio.connect(context.destination);
    },
    setAmplitude: function(value) {
      var time = __audio.context.currentTime;

      __audio.output.gain.linearRampToValueAtTime(value, time + 0.1);
    },
    noteOn: function(frequency) {
      var time = __audio.context.currentTime;

      __audio.vco.frequency.setValueAtTime(frequency, time);
      __audio.setAmplitude(1);
    },
    noteOff: function() {
      var time = __audio.context.currentTime;

      __audio.setAmplitude(0);
    },
    connect: function(target) {
      __audio.output.connect(target);
    }
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
  initAudio = function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    __audio.init(new AudioContext());
  },
  init = function() {
    initAudio();
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
    disableLeap: disableLeap,
    amp: function(value) {
      __audio.setAmplitude(value);
    },
    note: function(frequency) {
      if (frequency) {
        __audio.noteOn(frequency);
      } else {
        __audio.noteOff();
      }
    }
  };
}());