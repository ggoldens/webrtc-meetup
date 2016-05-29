var STUN = {
	url: 'stun:stun.l.google.com:19302'
};

VideoCall = {
	socket: io('https://webrtc-meetup-io.herokuapp.com'),

  showRemotePeer: function () {
    $('.video-wrap').toggleClass('twoVideo');
  },

  requestMediaStream: function() {
  	var constraints = {video:true, audio:true};
  	navigator.getUserMedia(constraints, VideoCall.onMediaStream);
  },

  onMediaStream: function (stream) {
  	VideoCall.localVideo = document.getElementById('myVideo');
  	VideoCall.localVideo.srcObject = stream;
  	VideoCall.localStream = stream;
  	VideoCall.signaling();
  },

  signaling: function () {
  	VideoCall.socket.on('offer', VideoCall.onOffer);
  	VideoCall.socket.on('answer', VideoCall.onAnswer);
  	VideoCall.socket.on('candidate', VideoCall.onCandidate);
  },

  onCandidate: function (candidate) {
  	var newCandidate = new RTCIceCandidate(candidate);
  	VideoCall.peerConnection.addIceCandidate(newCandidate);
  },

  onOffer: function (offer) {
  	VideoCall.createPeerConnection();
  	VideoCall.setRemoteDescription(offer);
		VideoCall.createAnswer();
  },

  onAnswer: function (answer) {
  	VideoCall.setRemoteDescription(answer);
  },

  createAnswer: function () {
  	VideoCall.peerConnection.createAnswer()
  	.then(function(desc){
  		VideoCall.peerConnection.setLocalDescription(desc);
  		VideoCall.socket.emit('answer', desc);
  	});
  },

  setRemoteDescription: function (sdp) {
  	var newSdp = new RTCSessionDescription(sdp);
  	VideoCall.peerConnection.setRemoteDescription(newSdp);
  },

  startCall: function () { 
  	VideoCall.createPeerConnection();
  	VideoCall.createOffer();
  },

  createPeerConnection: function (){
  	VideoCall.peerConnection = new RTCPeerConnection({iceServers: [STUN]});
  	VideoCall.peerConnection.addStream(VideoCall.localStream);
  	VideoCall.peerConnection.onicecandidate = VideoCall.onIceCandidate;
  	VideoCall.peerConnection.onaddstream = VideoCall.onAddStream;
  },

  onIceCandidate: function (event) {
  	if(event.candidate) {
  		VideoCall.socket.emit('candidate', event.candidate);
  	}
  },

  onAddStream: function (event) {
  	VideoCall.remoteVideo = document.getElementById('remoteVideo');
  	VideoCall.remoteVideo.srcObject = event.stream;	
    VideoCall.showRemotePeer();
  },

  createOffer: function () {
  	VideoCall.peerConnection.createOffer().then(function(desc){
  			VideoCall.peerConnection.setLocalDescription(desc);
  			VideoCall.socket.emit('offer', desc);
  	});
  },

}

var call = document.getElementById('call');
call.onclick = VideoCall.startCall;

VideoCall.requestMediaStream();