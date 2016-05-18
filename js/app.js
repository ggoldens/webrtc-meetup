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
	}

}

VideoCall.requestMediaStream();