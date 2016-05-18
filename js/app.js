VideoCall = {

	//Call getUserMedia API
	requestMediaStream: function() {
		var constraints = {video:true, audio:false};
		navigator.getUserMedia(constraints, this.onSuccessCallBack, this.onErrorCallBack);
	},

	//getUserMedia success callback
	onSuccessCallBack: function (stream){
		this.localVideo = document.getElementById('myVideo');
		this.localStream = stream;
		this.localVideo.srcObject = stream;

	},

	//getUserMedia on error callback
	onErrorCallBack: function (err) {
		console.log('navigator error:', err);
	}

}

VideoCall.requestMediaStream();