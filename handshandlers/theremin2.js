window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.theremin2 = {
  name: "Theremin 2.0",
  color: "success",
  handleHands: function(hands, audio) {
    var $handPosition, $fingers, hand, distance, amplitude, frequency;

    _.each(["left", "right"], function(which) {
      hand = hands[which];

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
          frequency = 800 - distance;
          frequency = Math.round(Math.pow(2, (frequency / 8 - 69) / 12) * 440);
        }
      } else {
        $handPosition.empty();
        $fingers.empty();
      }
    });

    if (hands.left && hands.right) {
      if (hands.left.isFist) {
        amplitude = 0;
      }

      if (hands.right.isFist) {
        audio.vco.type = audio.vco.SAWTOOTH;
      } else {
        audio.vco.type = audio.vco.SINE;
      }

      // if (Math.floor(audio.context.currentTime * 80) % 6 !== 0) {
      //   amplitude = 0;
      // }

      if (frequency !== audio.currentFrequency) {
        audio.setFrequency(frequency);
      }

      if (amplitude !== audio.currentAmplitude) {
        audio.setAmplitude(amplitude);
      }

      $("#note-frequency").html("Frequenz: " + frequency + "Hz");
      $("#note-amplitude").html("Amplitude: " + amplitude);
    } else {
      audio.silence();

      $("#note-frequency").empty();
      $("#note-amplitude").empty();
    }
  }
};