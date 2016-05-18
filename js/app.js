VideoCall = {

  //Call getUserMedia API
  requestMediaStream: function() {
    var constraints = {video:true, audio:false};
    navigator.getUserMedia(constraints, this.onSuccessCallback, this.onErrorCallback);
  },

  //getUserMedia success callback
  onSuccessCallback: function (stream){
    this.localVideo = document.getElementById('myVideo');
    this.localStream = stream;
    this.localVideo.srcObject = stream;
  },

  //getUserMedia on error callback
  onErrorCallback: function (err) {
    console.log('navigator error:', err);
  },

  //start a call 
  startCall: function () {
    // 1) create a peer connection object
    // 2) create and send the offer
    
  },

  //hang up a call 
  hangUpCall: function () {
    
  },

}

VideoCall.requestMediaStream();

var callBtn = document.getElementById('call');
var hangUpBtn = document.getElementById('hangup');
callBtn.onclick = VideoCall.startCall;
hangUpBtn.onclick = VideoCall.hangUpCall;