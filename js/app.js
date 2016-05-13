var STUN = {
    url: 'stun:stun.l.google.com:19302'
}

var logError = function(err) { console.log(err) }

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
    VideoCall.socket.on('offer', VideoCall.onCallOffer)
  },

  noMediaStream: function(error) {
    console.log('Something went wrong...', error);
  },

  startCall: function() {
    VideoCall.connect(VideoCall.createOffer)
  },

  connect: function(callback) {
    VideoCall.peerConnection = new RTCPeerConnection(VideoCall.iceServers)
    VideoCall.peerConnection.onicecandidate = VideoCall.onIceCandidate
    VideoCall.socket.on('candidate', VideoCall.onCandidate)
    VideoCall.socket.on('answer', VideoCall.onAnswer)
    callback()
  },

  createOffer: function() {
    VideoCall.peerConnection.createOffer()
      .then(function(desc) {
        VideoCall.peerConnection.setLocalDescription(desc)
        VideoCall.socket.emit('offer', desc)
      }, logError);
  },

  createAnswer: function(offer) {
    var newOffer = new RTCSessionDescription(offer)
    VideoCall.peerConnection.setRemoteDescription(newOffer)
    VideoCall.peerConnection.createAnswer()
      .then(function(answer) {
        VideoCall.peerConnection.setLocalDescription(answer)
        VideoCall.socket.emit('answer', answer)
      })
  },

  onIceCandidate: function(event) {
    // send the candidate info to the other peer
    VideoCall.socket.emit('candidate', event.candidate)
  },

  onCandidate: function(candidate) {
    var newCandidate = new RTCIceCandidate(candidate)
    VideoCall.peerConnection.addIceCandidate(newCandidate)
  },

  onCallOffer: function(offer) {
    console.log('Yay, received an offer')
    VideoCall.connect(function() {
      VideoCall.createAnswer(offer)
    })
  },

  onAnswer: function(answer) {
    var newAnswer = new RTCSessionDescription(answer)
    VideoCall.peerConnection.setRemoteDescription(newAnswer)
  }
}

VideoCall.requestMediaStream()

var callBtn = document.getElementById('call')
callBtn.onclick = VideoCall.startCall
