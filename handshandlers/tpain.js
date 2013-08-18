window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.tpain = {
  name: "T-Pain",
  color: "warning",
  handleHands: function(hands, audio) {
    var
    $handPosition, $fingers, hand, distance, amplitude, frequency,
    noteFrequencies = [
      16.35,
      18.35,
      20.60,
      21.83,
      24.50,
      27.50,
      30.87,
      32.70,
      36.71,
      41.20,
      43.65,
      49.00,
      55.00,
      61.74,
      65.41,
      73.42,
      82.41,
      87.31,
      98.00,
      110.00,
      123.47,
      130.81,
      146.83,
      164.81,
      174.61,
      196.00,
      220.00,
      246.94,
      261.63,
      293.66,
      329.63,
      349.23,
      392.00,
      440.00,
      493.88,
      523.25,
      587.33,
      659.26,
      698.46,
      783.99,
      880.00,
      987.77,
      1046.50,
      1174.66,
      1318.51,
      1396.91,
      1567.98,
      1760.00,
      1975.53,
      2093.00,
      2349.32,
      2637.02
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
            if (noteFrequencies[i] > frequency) {
              if (i > 0 && noteFrequencies[i] - frequency > frequency - noteFrequencies[i-1]) {
                frequency = noteFrequencies[i-1];
              } else {
                frequency = noteFrequencies[i];
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

      $("#note-frequency").html("Frequenz: " + frequency + "Hz");
      $("#note-amplitude").html("Amplitude: " + amplitude);
    } else {
      audio.silence();

      $("#note-frequency").empty();
      $("#note-amplitude").empty();
    }
  }
};