var VideoCall = {
  requestMediaStream: function(event) {
    navigator.getUserMedia(
      {video: true, audio: false},
      VideoCall.onMediaStream,
      VideoCall.noMediaStream
    );
  },

  onMediaStream: function(stream) {
    VideoCall.localVideo = document.getElementById('myVideo');
    VideoCall.localStream = stream;
    VideoCall.localVideo.srcObject = stream;
  },

  noMediaStream: function(error) {
    console.log('Something went wrong...', error);
  },

  startCall: function() {
    console.log('A call will start...')
  }
}

VideoCall.requestMediaStream()

var callBtn = document.getElementById('call')
callBtn.onclick = VideoCall.startCall
