var VideoCall = {
  
  /* 1) */
  requestMediaStream: function(event) {
    navigator.getUserMedia(
      {video: true, audio: false},
      VideoCall.onMediaStream,
      VideoCall.noMediaStream
    );
  },

  /* 2) onSuccess */
  onMediaStream: function(stream) {
    VideoCall.localVideo = document.getElementById('myVideo');
    VideoCall.localStream = stream;
    VideoCall.localVideo.srcObject = stream; //<video>
  },

  /* 3) Error callback */
  noMediaStream: function(error) {
    console.log('Something went wrong...', error);
  }
}

VideoCall.requestMediaStream()
