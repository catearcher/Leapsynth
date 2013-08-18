window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.silence = {
  name: "Silence",
  color: "danger",
  handleHands: function(hands, audio) {
    audio.silence();

    $("#note-frequency").empty();
    $("#note-amplitude").empty();
  }
};