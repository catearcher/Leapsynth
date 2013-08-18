window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.tpain = {
  name: "T-Pain",
  color: "warning",
  handleHands: function(hands, audio) {
    var
    $handPosition, $fingers, hand, distance, amplitude, frequency,
    noteFrequencies = [
      16.35,
      17.32,
      18.35,
      19.45,
      20.60,
      21.83,
      23.12,
      24.50,
      25.96,
      27.50,
      29.14,
      30.87,
      32.70,
      34.65,
      36.71,
      38.89,
      41.20,
      43.65,
      46.25,
      49.00,
      51.91,
      55.00,
      58.27,
      61.74,
      65.41,
      69.30,
      73.42,
      77.78,
      82.41,
      87.31,
      92.50,
      98.00,
      103.83,
      110.00,
      116.54,
      123.47,
      130.81,
      138.59,
      146.83,
      155.56,
      164.81,
      174.61,
      185.00,
      196.00,
      207.65,
      220.00,
      233.08,
      246.94,
      261.63,
      277.18,
      293.66,
      311.13,
      329.63,
      349.23,
      369.99,
      392.00,
      415.30,
      440.00,
      466.16,
      493.88,
      523.25,
      554.37,
      587.33,
      622.25,
      659.26,
      698.46,
      739.99,
      783.99,
      830.61,
      880.00,
      932.33,
      987.77,
      1046.50,
      1108.73,
      1174.66,
      1244.51,
      1318.51,
      1396.91,
      1479.98,
      1567.98,
      1661.22,
      1760.00,
      1864.66,
      1975.53,
      2093.00,
      2217.46,
      2349.32,
      2489.02,
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
          frequency = 800 - distance;
          frequency = Math.round(Math.pow(2, (frequency / 10 - 69) / 12) * 440);

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