var STUN = {
	urls: ['stun:stun.l.google.com:19302'] 
};

var logError = function (err) { console.log(err) }

VideoCall = {
	socket: io('https://webrtc-meetup-io.herokuapp.com'),

  requestMediaStream: function() {
		 // The fun starts here!
  },

  startCall: function () { },

  hangUp: function () { },

}

var call = document.getElementById('call');
var hangup = document.getElementById('hangup');
call.onclick = VideoCall.startCall;
hangup.onclick = VideoCall.hangUp;


VideoCall.requestMediaStream();