var STUN = {
	urls: 'stun:stun.l.google.com:19302'
};

VideoCall = {
	socket: io('https://webrtc-meetup-io.herokuapp.com'),

  requestMediaStream: function() {
  	var constraints = {video:true, audio:false};
  	navigator.getUserMedia(constraints, VideoCall.onMediaStream);
  },

  onMediaStream: function (stream) {
  	VideoCall.localVideo = document.getElementById('myVideo');
  	VideoCall.localVideo.srcObject = stream;
  	VideoCall.localStream = stream;
  },

  startCall: function () { },

}

var call = document.getElementById('call');
call.onclick = VideoCall.startCall;

VideoCall.requestMediaStream();