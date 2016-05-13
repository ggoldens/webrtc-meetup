var STUN = {
    url: 'stun:stun.l.google.com:19302'
}

var VideoCall = {
  iceServers: { iceServers: [STUN] },
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
    VideoCall.peerConnection = new RTCPeerConnection(VideoCall.iceServers)
    VideoCall.peerConnection.onicecandidate = VideoCall.onIceCandidate
  },

  onIceCandidate: function(event) {
    // send the candidate info to the other peer
  }
}

VideoCall.requestMediaStream()

var callBtn = document.getElementById('call')
callBtn.onclick = VideoCall.startCall
