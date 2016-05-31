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
    var user_id = event.stream.connection.connectionId;
    if(session.connection.connectionID != user_id){
      $("#user_holder").append(userBoxTemplate(user_id));
      session.subscribe(event.stream,'user_'+user_id,streamUIOptions);
    }
  })
  .on('streamDestroyed', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#user_holder").remove("#box_"+user_id);
  })
  .on('signal:start_publishing',function(){
    $("#user_holder").append(userBoxTemplate(session.connection.connectionId));
    publisher = OT.initPublisher('user_'+session.connection.connectionId,streamUIOptions,function(){
      console.log("ready to publish");
    });
    session.publish(publisher);
  })
  .on('signal:clear_question', function(event) {
    $("#question").html("");
    $("#answer_fields").addClass("hidden");
    $(".participant").removeClass("active");
  })
  .on('signal:new_question', function(event) {
    countbackToQuestion(event.data.question);
  })
  .on('signal:question_answered', function(event) {
    $("#answer_"+event.from.connectionId).html(event.data.answer).addClass("answered").removeClass("hidden");
  })
  .on('signal:reveal_answers', function(event) {
    $(".user_answer").removeClass("answered");
  })
  .connect(token, function(error) {
    console.log("Connected to session");
  });

var countbackToQuestion = function (question) {
    $("#question").html("GET READY!");
    $("#answer_fields").addClass("hidden");
    setTimeout(function(){startCounting(question)},2000);
};

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
    if(publisher){
      $("#answer_fields").removeClass("hidden");
    }
    count = 3;
  }
}

var userBoxTemplate = function(connection_Id){
  var template = _.template('<div class="col-md-6" id="<%- user_box_id %>">'+
    '<div class="participant left" id="<%- box_id %>">'+
    '<span class="placeholder_waiting">Waiting For Participant</span>'+
    '</div>'+
    '<div class="user_answer hidden left" id="<%- answer_id %>">'+
    '<span>Esta es la respuesta de mia</span>'+
    '</div>'+
    '</div>');
  return template({user_box_id:"box_"+connection_Id,box_id:"user_"+connection_Id, answer_id:"answer_"+connection_Id});
};




$(document).ready(function(){

  $("#answer_question").click(function() {
    var message = {
      type: 'question_answered',
      data:{
        answer:$("#answer").val()
      }
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('answer has been sent!');
      }});
  });
});
