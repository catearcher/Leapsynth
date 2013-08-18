window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.theremin = {
  name: "Theremin",
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
          frequency = 1000 - distance;
          frequency = Math.round(frequency);
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