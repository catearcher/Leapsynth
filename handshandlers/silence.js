window.LSHandsHandlers = window.LSHandsHandlers || {};

LSHandsHandlers.silence = {
  name: "Silence",
  color: "danger",
  handleHands: function(hands, context) {
    context.silence();

    $("#note-frequency").empty();
    $("#note-amplitude").empty();
  }
};