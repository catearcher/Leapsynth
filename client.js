var LS = (function() {
  var
  __hands = {
    left: null,
    right: null
  },
  __activeSynthesizer = null,
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

      __audio.vco.start(__audio.context.currentTime);
      __audio.lfo.start(__audio.context.currentTime);

      __audio.connect(context.destination);
    },
    loadDefaults: function() {
      __audio.vco.type = __audio.vco.SINE;
      __audio.lfo.type = __audio.lfo.SINE;
      __audio.vcf.frequency.value = __audio.vcf.frequency.defaultValue;
      __audio.lfoGain.gain.value = __audio.lfoGain.gain.defaultValue;
      __audio.vcf.type = __audio.vcf.LOWPASS;
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
  activateSynthesizer = function(handlerId) {
    var $panel = $("#synthesizers-panel");

    __audio.loadDefaults();
    __activeSynthesizer = LSsynthesizers[handlerId];
    $panel.attr("class", "panel");

    if (__activeSynthesizer.color) {
      $panel.addClass("panel-" + __activeSynthesizer.color);
    }

    $panel.find(".active-synthesizer-name").text(__activeSynthesizer.name);
    $panel.find("#synthesizer-description").text(__activeSynthesizer.description);
  },
  activateInstrument = function(instrumentId) {
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
      __activeSynthesizer.handleHands(__hands, __audio);
    });

    $panel.attr("class", "panel");

    if (__activeInstrument.color) {
      $panel.addClass("panel-" + __activeInstrument.color);
    }

    $panel.find(".active-instrument-name").text(__activeInstrument.name);
    $panel.find("#instrument-description").text(__activeInstrument.description);
  },
  attachDomHandlers = function() {
    $(".button-enable-leap").on("click", function() {
      enableLeap();
    });

    $(".button-disable-leap").on("click", function() {
      disableLeap();
    });

    $(document).on("click", ".switch-to-handler", function() {
      activateSynthesizer($(this).attr("data-id"));
    });

    $(document).on("click", ".switch-to-instrument", function() {
      activateInstrument($(this).attr("data-id"));
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

    data.isFist = data.fingers < 2;

    __hands[which] = data;
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
  createsynthesizersButtons = function() {
    _.each(LSsynthesizers, function(handler, key) {
      var $button = $("<button>")
         .addClass("btn switch-to-handler")
         .attr("data-id", key)
         .text(handler.name);

      if (handler.color) {
        $button.addClass("btn-" + handler.color)
      }

      $("#synthesizers").append($button).append(" ");
    });
  },
  initAudio = function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    __audio.init(new AudioContext());
  },
  init = function() {
    initAudio();
    attachDomHandlers();
    createsynthesizersButtons();
    createInstrumentsButtons();
    activateSynthesizer("tpain");
    activateInstrument("leapmotion");
  };


  init();

  return {
    init: init,
    audio: __audio
  };
}());