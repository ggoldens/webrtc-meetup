/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '2_MX40NTU5NjE4Mn5-MTQ2NDIzNjc3Nzg1NX5Gcy9pNUFIYVY4NFZqMldLdHI0bFpqTk9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTU5NjE4MiZzaWc9YjhjNjM3NjlmMjAzMTZlODAxZjNiZDY3ZWRiNmU4Y2QxZGFkNjYyYTpzZXNzaW9uX2lkPTJfTVg0ME5UVTVOakU0TW41LU1UUTJOREl6TmpjM056ZzFOWDVHY3k5cE5VRklZVlk0TkZacU1sZExkSEkwYkZwcVRrOS1mZyZjcmVhdGVfdGltZT0xNDY0MjM2ODEyJm5vbmNlPTAuNjQxMTg5MTI1NTk5MzM5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY2ODI4ODEy';
var publisher = null;
var count = 3;

var streamUIOptions = {
  showControls: false,
  width: "100%",
  height: "100%",
  frameRate: 15,
  insertMode: 'append',
  publishAudio:false,
  fitMode: 'contain'
};

var session = OT.initSession(apiKey, sessionId)
  .on('streamCreated', function(event) {
    session.subscribe(event.stream,'user_2',streamUIOptions);
  })
  .on('signal:clear_question', function(event) {
    $("#question").html("");
    $(".red_button").addClass("hidden");
    $(".participant").removeClass("active");

  })
  .on('signal:new_question', function(event) {
    countbackToQuestion(event.data.question);
  })
  .on('signal:challenge_accepted', function(event) {
    console.log("Challenge Accepted")
    if(publisher.stream.connection.connectionId == event.from.connectionId){
      $("#user_1").addClass("active");
    }else{
      $("#user_2").addClass("active");
    }
  })
  .connect(token, function(error) {
    publisher = OT.initPublisher('user_1',streamUIOptions,function(){
      console.log("ready to publish");
    });
    session.publish(publisher);
  });

var countbackToQuestion = function (question) {
    $("#question").html("GET READY!");
    $(".red_button").addClass("hidden");
    setTimeout(function(){startCounting(question)},2000);
}

var startCounting = function(question){

  var interval_count = setInterval(function(){ countback() }, 1000);
  var countback = function() {
    if(count == 0){
      stopCounting()
    }else{
      $("#question").html(count);
      --count;
    }
  }

  var stopCounting = function() {
    clearInterval(interval_count);
    $("#question").html(question);
    $(".red_button").removeClass("hidden");
    count = 3;
  }
}




$(document).ready(function(){

  $(".red_button").click(function() {
    var message = {
      type: 'challenge_accepted'
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });
});
