var LS = (function() {
  var
  __hands = {
    left: null,
    right: null
  },
  __activeHandsHandler = null,
  __activeInstrument = null,
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
  activeateInstrument = function(instrumentId) {
    var $panel = $("#instruments-panel");

    if (__activeInstrument) {
      __activeInstrument.destroy();
      $(document).off("handsChange");
    }

    __activeInstrument = LSInstruments[instrumentId];
    __activeInstrument.init({
      "updateHand": updateHand,
      "clearHand": clearHand
    });

    $(document).on("handsChange", function() {
      __activeHandsHandler.handleHands(__hands, __audio);
    });

    $panel.attr("class", "panel");

    if (__activeInstrument.color) {
      $panel.addClass("panel-" + __activeInstrument.color);
    }

    $panel.find(".active-instrument-name").text(__activeInstrument.name);
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
  createInstrumentsButtons = function() {
    _.each(LSInstruments, function(instrument, key) {
      var $button = $("<button>")
         .addClass("btn switch-to-instrument")
         .attr("data-id", key)
         .text(instrument.name);

      if (instrument.color) {
        $button.addClass("btn-" + instrument.color)
      }

      $("#instruments").append($button).append(" ");
    });
  },
  createHandsHandlersButtons = function() {
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
  },
  initAudio = function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    __audio.init(new AudioContext());
  },
  init = function() {
    initAudio();
    attachDomHandlers();
    createHandsHandlersButtons();
    createInstrumentsButtons();
    activateHandsHandler("tpain");
    activeateInstrument("leapmotion");
  };


  init();

  return {
    init: init,
    audio: __audio
  };
}());