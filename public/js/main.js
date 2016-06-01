$( document ).ready(function() {
  $( " .video-box " ).click(function() {
    $( " .twoVideo .video-box " ).toggleClass( "top-vid" );
  });
});

$( document ).ready(function() {
  $( " .show-input " ).click(function() {
    $( " .answer-this " ).removeClass( "hide" );
  });
});

$( document ).ready(function() {
  $( " .hide-box " ).click(function() {
    $( " .answer-this " ).addClass( "hide" );
  });
});

