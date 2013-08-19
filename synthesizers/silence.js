window.LSsynthesizers = window.LSsynthesizers || {};

LSsynthesizers.silence = {
  name: "Silence",
  description: "Nothing but silence.",
  color: "danger",
  handleHands: function(hands, audio) {
    audio.silence();

    $("#note-frequency").empty();
    $("#note-amplitude").empty();
  }
};