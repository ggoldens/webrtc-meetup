/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '2_MX40NTU5NjE4Mn5-MTQ2NDIzNjc3Nzg1NX5Gcy9pNUFIYVY4NFZqMldLdHI0bFpqTk9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTU5NjE4MiZzaWc9YjhjNjM3NjlmMjAzMTZlODAxZjNiZDY3ZWRiNmU4Y2QxZGFkNjYyYTpzZXNzaW9uX2lkPTJfTVg0ME5UVTVOakU0TW41LU1UUTJOREl6TmpjM056ZzFOWDVHY3k5cE5VRklZVlk0TkZacU1sZExkSEkwYkZwcVRrOS1mZyZjcmVhdGVfdGltZT0xNDY0MjM2ODEyJm5vbmNlPTAuNjQxMTg5MTI1NTk5MzM5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY2ODI4ODEy';
var publisher = null;
var challenger_1 = null;
var challenger_2 = null;
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
    if (challenger_1 && challenger_2) {
      return;
    } else if (!challenger_1) {
      challenger_1 = event.stream.id;
      session.subscribe(event.stream, "user_1", streamUIOptions, function () {
        $("#user_1").addClass("spot_taken");
      });
    } else if (!challenger_2) {
      challenger_b = event.stream.id;
      session.subscribe(event.stream, "user_2", streamUIOptions, function () {
        $("#user_2").addClass("spot_taken");
      });
    }
  })
  .on('signal:clear_question', function(event) {
    $("#current_question").html("");
  })
  .on('signal:countback', function(event) {
    console.log("starting countback")
  })
  .on('signal:new_question', function(event) {
    console.log("New Question"+event.data.question);
    $("#current_question").html(event.data.question);
  })
  .on('signal:challenge_accepted', function(event) {
    if(publisher.stream.connection.connectionId == event.from.connectionId){
      console.log("YOU ANSWER")
    }else{
      console.log("HE ANSWER")
    }
  })
  .connect(token, function(error) {
    console.log("admin in session");
  });


$(document).ready(function(){

  $("#send_question").click(function() {
    var message = {
      type: 'new_question',
      data:{
        "question": $("#question").val()
      }
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });

  $("#clear_question").click(function() {
    var message = {
      type: 'clear_question'
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });


});
