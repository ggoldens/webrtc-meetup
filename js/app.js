var STUN = {
    url: 'stun:stun.l.google.com:19302'
}

var VideoCall = {
  iceServers: { iceServers: [STUN] },
  socket: io('https://webrtc-meetup-io.herokuapp.com'),

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
    VideoCall.socket.on('candidate', VideoCall.onCandidate)
  },

  onIceCandidate: function(event) {
    // send the candidate info to the other peer
    VideoCall.socket.emit('candidate', event.candidate)
  },

  onCandidate: function(candidate) {
    var newCandidate = new RTCIceCandidate(candidate)
    VideoCall.peerConnection.addIceCandidate(newCandidate)
  }
}

VideoCall.requestMediaStream()

var callBtn = document.getElementById('call')
callBtn.onclick = VideoCall.startCall
