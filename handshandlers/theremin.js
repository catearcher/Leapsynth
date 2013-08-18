window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.theremin = {
  handleHands: function(hands, context) {
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
        if (amplitude !== context.currentAmplitude) {
          context.setAmplitude(amplitude);
        }
      } else {
        context.setAmplitude(0);
      }

      if (frequency !== context.currentFrequency) {
        context.noteOn(frequency);
      }

      $("#note-frequency").html("Frequenz: " + frequency + "Hz");
      $("#note-amplitude").html("Amplitude: " + amplitude);
    } else {
      context.noteOff();

      $("#note-frequency").empty();
      $("#note-amplitude").empty();
    }
  }
};