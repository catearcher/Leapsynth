window.LSsynthesizers = window.LSsynthesizers || {};

LSsynthesizers.bass = {
  name: "Bass",
  description: "Drop it!",
  color: "info",
  handleHands: function(hands, audio) {
    var
    $handPosition, $fingers, hand, distance, amplitude, frequency,
    frequencyDescription = "",
    noteFrequencies = [
      ["E1", 41.20],
      ["F1", 43.65],
      ["G1", 49.00],
      ["A1", 55.00],
      ["H1", 61.74],
      ["C2", 65.41],
      ["D2", 73.42],
      ["E2", 82.41],
      ["F2", 87.31],
      ["G2", 98.00],
      ["A2", 110.00],
      ["H2", 123.47],
      ["C3", 130.81],
      ["D3", 146.83],
      ["E3", 164.81],
      ["F3", 174.61],
      ["G3", 196.00],
      ["A3", 220.00],
      ["H3", 246.94],
      ["C4", 261.63],
      ["D4", 293.66],
      ["E4", 329.63],
      ["F4", 349.23],
      ["G4", 392.00]
    ];

    audio.lfo.frequency.value = 250;
    audio.lfoGain.gain.value = .5;
    audio.vcf.frequency.value = 392;

    _.each(["left", "right"], function(which) {
      var i;

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
            frequency = 500 - distance;
            frequency = Math.round(Math.pow(2, (frequency / 20 - 29) / 12) * 440);

            for (i = 0; i < noteFrequencies.length; i++) {
              if (noteFrequencies[i][1] > frequency) {
                if (i > 0 && noteFrequencies[i][1] - frequency > frequency - noteFrequencies[i-1][1]) {
                  frequency = noteFrequencies[i-1][1];
                  frequencyDescription = "(" + noteFrequencies[i-1][0] + ")";
                } else {
                  frequency = noteFrequencies[i][1];
                  frequencyDescription = "(" + noteFrequencies[i][0] + ")";
                }

                break;
              }
            }
          }
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

      if (frequency !== audio.currentFrequency) {
        audio.setFrequency(frequency);
      }

      if (amplitude !== audio.currentAmplitude) {
        audio.setAmplitude(amplitude);
      }

      $("#note-frequency").html("Frequenz: " + frequency + "Hz " + frequencyDescription);
      $("#note-amplitude").html("Amplitude: " + amplitude);
    } else {
      audio.silence();

      $("#note-frequency").empty();
      $("#note-amplitude").empty();
    }
  }
};