var LS = (function() {
  var
  __isLeapEnabled = true,
  __hands = {
    left: null,
    right: null
  },
  __activeHandsHandler = null,
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
      __audio.vco.type = __audio.vco.SINE;
      __audio.lfo.type = __audio.lfo.SINE;
      __audio.vco.start(__audio.context.currentTime);
      __audio.lfo.start(__audio.context.currentTime);

      __audio.connect(context.destination);
    },
    loadDefaults: function() {
      __audio.vco.type = __audio.vco.SINE;
      __audio.lfo.type = __audio.lfo.SINE;
    },
    setAmplitude: function(value) {
      var time = __audio.context.currentTime;

      __audio.output.gain.linearRampToValueAtTime(value, time + 0.2);
      __audio.currentAmplitude = value;
    },
    setFrequency: function(frequency) {
      var time = __audio.context.currentTime;

      __audio.vco.frequency.setValueAtTime(frequency, time);
      __audio.currentFrequency = frequency;
    },
    silence: function() {
      __audio.setAmplitude(0);
    },
    connect: function(target) {
      __audio.output.connect(target);
    }
  },
  activateHandsHandler = function(handlerId) {
    var $panel = $("#handlers-panel");

    __audio.loadDefaults();
    __activeHandsHandler = LSHandsHandlers[handlerId];
    $panel.attr("class", "panel");

    if (__activeHandsHandler.color) {
      $panel.addClass("panel-" + __activeHandsHandler.color);
    }

    $panel.find(".active-handler-name").text(__activeHandsHandler.name);
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

    $(document).on("click", ".switch-to-handler", function() {
      activateHandsHandler($(this).attr("data-id"));
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
      fingers: data.fingers.length,
      isFist: data.fingers.length < 2
    };
  },
  initAudio = function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    __audio.init(new AudioContext());
  },
  init = function() {
    initAudio();
    attachDomHandlers();
    activateHandsHandler("theremin2");

    _.each(LSHandsHandlers, function(handler, key) {
      var $button = $("<button>")
         .addClass("btn switch-to-handler")
         .attr("data-id", key)
         .text(handler.name);

      if (handler.color) {
        $button.addClass("btn-" + handler.color)
      }

      $("#handshandlers").append($button).append(" ");
    });

    Leap.loop({enableGestures: false}, function(frame) {
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

        __activeHandsHandler.handleHands(__hands, __audio);
      }
    });
  };


  init();

  return {
    init: init,
    audio: __audio
  };
}());