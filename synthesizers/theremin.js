window.LSsynthesizers = window.LSsynthesizers || {};

LSsynthesizers.theremin = {
  name: "Theremin",
  description: "The first LeapSynth synthesizer. A little rough around the edges, but it works.",
  color: "success",
  handleHands: function(hands, audio) {
    var $handPosition, $fingers, hand, distance, amplitude, frequency;

    _.each(["left", "right"], function(which) {
      hand = hands[which];

      $handPosition = $("#" + which + "-hand-position");
      $fingers = $("#" + which + "-hand-fingers");

      if (hand) {
        if (hand.position) {
          distance = hand.position[1];
          $handPosition.html("Position der Hand: " + hand.position.join(" / "));
        }

        if (hand.fingers) {
          $fingers.html("Anzahl der Finger: " + hand.fingers);
        }

        if (which === "left") {
          if (hand.amplitude) {
            amplitude = hand.amplitude;
          } else {
            amplitude = 4 - (distance / 100);
            amplitude = Math.round(10*amplitude) / 10;
          }
        } else {
          if (hand.frequency) {
            frequency = hand.frequency;
          } else {
            frequency = 1000 - distance;
            frequency = Math.round(frequency);
          }
        }
      } else {
        $handPosition.empty();
        $fingers.empty();
      }
    });

    if (hands.left && hands.right) {
      if (hands.left.fingers >= 2) {
        if (amplitude !== audio.currentAmplitude) {
          audio.setAmplitude(amplitude);
        }
      } else {
        audio.setAmplitude(0);
      }

      if (frequency !== audio.currentFrequency) {
        audio.setFrequency(frequency);
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