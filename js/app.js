var STUN = {
	urls: ['stun:stun.l.google.com:19302'] 
};

var logError = function (err) { console.log('Error ---> ', err) }

VideoCall = {
	socket: io('https://webrtc-meetup-io.herokuapp.com'),

  requestMediaStream: function() {
  	var constraints = {video:true, audio:false};
  	navigator.getUserMedia(constraints, VideoCall.onMediaStream, logError);
  },

  onMediaStream: function (stream) {
  	VideoCall.localVideo = document.getElementById('myVideo');
  	VideoCall.localVideo.srcObject = stream;
  	VideoCall.localStream = stream;
  },

  startCall: function () { },

  hangUp: function () { },

}

var call = document.getElementById('call');
var hangup = document.getElementById('hangup');
call.onclick = VideoCall.startCall;
hangup.onclick = VideoCall.hangUp;


VideoCall.requestMediaStream();