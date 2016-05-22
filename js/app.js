var STUN = {
	urls:'stun:stun.l.google.com:19302'
};

VideoCall = {
	socket: io('https://webrtc-meetup-io.herokuapp.com'),
	requestMediaStream: function() {
		 // The fun starts here!
  },

  startCall: function () { },

}

var call = document.getElementById('call');
call.onclick = VideoCall.startCall;

VideoCall.requestMediaStream();