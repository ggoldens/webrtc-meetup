/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '2_MX40NTU5NjE4Mn5-MTQ2NDIzNjc3Nzg1NX5Gcy9pNUFIYVY4NFZqMldLdHI0bFpqTk9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTU5NjE4MiZzaWc9YjhjNjM3NjlmMjAzMTZlODAxZjNiZDY3ZWRiNmU4Y2QxZGFkNjYyYTpzZXNzaW9uX2lkPTJfTVg0ME5UVTVOakU0TW41LU1UUTJOREl6TmpjM056ZzFOWDVHY3k5cE5VRklZVlk0TkZacU1sZExkSEkwYkZwcVRrOS1mZyZjcmVhdGVfdGltZT0xNDY0MjM2ODEyJm5vbmNlPTAuNjQxMTg5MTI1NTk5MzM5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY2ODI4ODEy';
var publisher = null;
var my_connection_id = null;
var users = [];

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
  .on('connectionCreated',function(event){
    console.log(event);
    if(event.connection != session.connection){
      users.push(event.connection);
      $("#user_count").html(users.length);
    }
  })
  .on('connectionDestroyed',function(event){
    console.log(event);
    var index = users.indexOf(event.connection);
    if (index > -1) {
      users.splice(index, 1);
    }
    $("#user_count").html(users.length);
  })
  .on('streamCreated', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#user_holder").append(userBoxTemplate(user_id));
    session.subscribe(event.stream,'user_'+user_id,streamUIOptions);
  })
  .on('streamDestroyed', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#user_holder").remove("#box_"+user_id);
  })
  .on('signal:clear_question', function(event) {
    $("#asked_question").html("");
  })
  .on('signal:new_question', function(event) {
    $("#asked_question").html(event.data.question);
  })
  .on('signal:question_answered', function(event) {
    $("#answer_"+event.from.connectionId).html(event.data.answer).addClass("answered").removeClass("hidden");
  })
  .on('signal:reveal_answers', function(event) {
    $(".user_answer").removeClass("answered");
  })
  .connect(token, function(error) {
    console.log("admin in session");
  });

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

  $("#reveal_answers").click(function() {
    var message = {
      type: 'reveal_answers'
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onreveal_answers:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });


  $("#start_round").click(function () {
    var temp_users = _.sample(users,2);
    _.each(temp_users,function(user){
      session.signal({type:"start_publishing",to:user},function (error) {
        if (error) {
          console.log('onSendStartPublishing:ERROR', error);
        } else {
          console.log('warning signal sent.');
        }});
    });

  });


});
