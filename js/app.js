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

  createPeerConnection: function () {
    VideoCall.peerConnection = new RTCPeerConnection(VideoCall.iceServers);
    VideoCall.peerConnection.addStream(VideoCall.localStream);
    VideoCall.peerConnection.onaddstream = VideoCall.onAddStream //onStreamCreated de tokbox
    VideoCall.peerConnection.onicecandidate = VideoCall.onIceCandidate
    VideoCall.socket.on('candidate', VideoCall.onCandidate)
  },

  onCandidate: function(candidate) {
    console.log('candidate received', candidate)
    var newCandidate = new RTCIceCandidate(candidate)
    VideoCall.peerConnection.addIceCandidate(newCandidate)
  },

  onAddStream: function(event) {
    console.log('onAddStream', event);
    VideoCall.remoteVideo = document.getElementById('remoteVideo');
    VideoCall.remoteVideo.srcObject = event.stream;
  },

  onIceCandidate: function(event) {
    // send the candidate info to the other peer
    console.log('onIceCandidate')
    if (event && event.candidate) VideoCall.socket.emit('candidate', event.candidate)
  },

  /* Local */

  startCall: function() {
    VideoCall.socket.on('answer', VideoCall.onAnswer)
    VideoCall.createPeerConnection();
    VideoCall.createOffer();
  },

  createOffer: function () {
    //Create offer
    VideoCall.peerConnection.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    })
      .then(function(desc) { //SDP
        VideoCall.peerConnection.setLocalDescription(desc)
        VideoCall.socket.emit('offer', desc)
      }, logError);
  },

  onCallOffer: function(offer) {
    console.log('Yay, received an offer', offer);
    VideoCall.acceptCall(offer);
  },

  onAnswer: function(answer) {
    console.log('onAnswer callback', answer)
    var newAnswer = new RTCSessionDescription(answer)
    VideoCall.peerConnection.setRemoteDescription(newAnswer)
  },

  /* Remote */

  acceptCall: function (offer){
    VideoCall.createPeerConnection();
    VideoCall.createAnswer(offer);
  },

  createAnswer: function(offer) {
    var newOffer = new RTCSessionDescription(offer)
    VideoCall.peerConnection.setRemoteDescription(newOffer)
    VideoCall.peerConnection.createAnswer()
      .then(function(answer) { //sdp
        VideoCall.peerConnection.setLocalDescription(answer)
        VideoCall.socket.emit('answer', answer)
      }, logError)
  },




}

VideoCall.requestMediaStream();

var callBtn = document.getElementById('call');
callBtn.onclick = VideoCall.startCall;
