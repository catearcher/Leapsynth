window.LSsynthesizers = window.LSsynthesizers || {};

LSsynthesizers.tpain = {
  name: "T-Pain",
  description: "Leap it like T-Pain! This synthesizer makes it impossible to play nonstandard notes.",
  color: "warning",
  handleHands: function(hands, audio) {
    var
    $handPosition, $fingers, hand, distance, amplitude, frequency,
    frequencyDescription = "",
    noteFrequencies = [
      ["C0", 16.35],
      ["D0", 18.35],
      ["E0", 20.60],
      ["F0", 21.83],
      ["G0", 24.50],
      ["A0", 27.50],
      ["H0", 30.87],
      ["C1", 32.70],
      ["D1", 36.71],
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
      ["G4", 392.00],
      ["A4", 440.00],
      ["H4", 493.88],
      ["C5", 523.25],
      ["D5", 587.33],
      ["E5", 659.26],
      ["F5", 698.46],
      ["G5", 783.99],
      ["A5", 880.00],
      ["H5", 987.77],
      ["C6", 1046.50],
      ["D6", 1174.66],
      ["E6", 1318.51],
      ["F6", 1396.91],
      ["G6", 1567.98],
      ["A6", 1760.00],
      ["H6", 1975.53],
      ["C7", 2093.00],
      ["D7", 2349.32],
      ["E7", 2637.02]
    ];

    _.each(["left", "right"], function(which) {
      var i;

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
          frequency = 1800 - distance;
          frequency = Math.round(Math.pow(2, (frequency / 20 - 69) / 12) * 440);

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