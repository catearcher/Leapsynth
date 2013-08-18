var LS = (function() {
  var
  __isLeapEnabled = true,
  __hands = {
    left: null,
    right: null
  },
  __audio = {
    currentAmplitude: null,
    currentFrequency: null,
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
      __audio.currentAmplitude = value;
    },
    noteOn: function(frequency) {
      var time = __audio.context.currentTime;

      __audio.vco.frequency.setValueAtTime(frequency, time);
      __audio.currentFrequency = frequency;
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
      }),
      fingers: data.fingers.length
    };
  },
  handleHands = function() {
    var $handPosition, $fingers, hand, distance, amplitude, frequency;

    _.each(["left", "right"], function(which) {
      hand = __hands[which];

      $handPosition = $("#" + which + "-hand-position");
      $fingers = $("#" + which + "-hand-fingers");

      if (hand) {
        $handPosition.html("Position der Hand: " + hand.position.join(" / "));
        $fingers.html("Anzahl der Finger: " + hand.fingers);

        distance = hand.position[1];

        if (which === "left") {
          amplitude = 4 - (distance / 100);
          amplitude = Math.round(10*amplitude) / 10;
        } else {
          frequency = 1000 - distance;
          frequency = Math.round(frequency);
        }
      } else {
        $handPosition.empty();
        $fingers.empty();
      }
    });

    if (__hands.left && __hands.right) {
      if (__hands.left.fingers >= 2) {
        if (amplitude !== __audio.currentAmplitude) {
          __audio.setAmplitude(amplitude);
        }
      } else {
        __audio.setAmplitude(0);
      }

      if (frequency !== __audio.currentFrequency) {
        __audio.noteOn(frequency);
      }

      $("#note-frequency").html("Frequenz: " + frequency + "Hz");
      $("#note-amplitude").html("Amplitude: " + amplitude);
    } else {
      __audio.noteOff();

      $("#note-frequency").empty();
      $("#note-amplitude").empty();
    }
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