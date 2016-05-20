VideoCall = {

  requestMediaStream: function() {
    var constraints = {video:true, audio:false};
    navigator.getUserMedia(constraints, this.onSuccessCallback, this.onErrorCallback);
  },

  onSuccessCallback: function (stream){
    this.localVideo = document.getElementById('myVideo');
    this.localStream = stream;
    this.localVideo.srcObject = stream;
  },

  onErrorCallback: function (err) {
    console.log('navigator error:', err);
  },

  startCall: function () {
    
  },
  
  hangUpCall: function () {
    
  },

}

VideoCall.requestMediaStream();

var callBtn = document.getElementById('call');
var hangUpBtn = document.getElementById('hangup');
callBtn.onclick = VideoCall.startCall;
hangUpBtn.onclick = VideoCall.hangUpCall;