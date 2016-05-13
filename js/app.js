var STUN = {
    urls: ['stun:stun.l.google.com:19302']
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
    VideoCall.peerConnection.addStream(VideoCall.localStream)
    VideoCall.peerConnection.onicecandidate = VideoCall.onIceCandidate
    VideoCall.peerConnection.onaddstream = VideoCall.onAddStream
    VideoCall.socket.on('candidate', VideoCall.onCandidate)
    VideoCall.socket.on('answer', VideoCall.onAnswer)
    callback()
  },

  createOffer: function() {
    VideoCall.peerConnection.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(function(desc) {
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
      }, logError)
  },

  onIceCandidate: function(event) {
    // send the candidate info to the other peer
    console.log('onIceCandidate')
    if (event && event.candidate) VideoCall.socket.emit('candidate', event.candidate)
  },

  onCandidate: function(candidate) {
    console.log('candidate received')
    var newCandidate = new RTCIceCandidate(candidate)
    VideoCall.peerConnection.addIceCandidate(newCandidate)
  },

  onCallOffer: function(offer) {
    console.log('Yay, received an offer', offer)
    VideoCall.connect(function() {
      VideoCall.createAnswer(offer)
    })
  },

  onAnswer: function(answer) {
    console.log('onAnswer callback', answer)
    var newAnswer = new RTCSessionDescription(answer)
    VideoCall.peerConnection.setRemoteDescription(newAnswer)
  },

  onAddStream: function(event) {
    console.log('onAddStream')
    VideoCall.remoteVideo = document.getElementById('remoteVideo')
    VideoCall.remoteVideo.srcObject = event.stream
  }
}

VideoCall.requestMediaStream()

var callBtn = document.getElementById('call')
callBtn.onclick = VideoCall.startCall
